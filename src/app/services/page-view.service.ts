import { DOCUMENT } from '@angular/common';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { supportsViewCounting } from '../config/firebase.config';
import { DevModeService } from './dev-mode.service';

export const VIEW_COUNTER_LOADER = new InjectionToken<() => Promise<(slug: string) => Promise<unknown>>>(
  'VIEW_COUNTER_LOADER', {
    providedIn: 'root',
    factory: () => () => import('./page-view-client').then(client => client.createViewCounter()),
  },
);

@Injectable({ providedIn: 'root' })
export class PageViewService {
  private readonly document = inject(DOCUMENT);
  private readonly devMode = inject(DevModeService);
  private readonly loadCounter = inject(VIEW_COUNTER_LOADER);
  private readonly recordedSlugs = new Set<string>();
  private counter?: Promise<(slug: string) => Promise<unknown>>;

  record(slug: string): void {
    const href = this.document.location?.href;
    if (!href || this.devMode.isDevMode() || !supportsViewCounting(new URL(href))) return;
    if (this.recordedSlugs.has(slug)) return;
    const storageKey = `ih_viewed:${slug}`;
    try {
      if (this.document.defaultView?.sessionStorage.getItem(storageKey) === '1') return;
    } catch {
      // Use the in-memory guard when browser storage is unavailable.
    }

    // Reserve before the async call so rapid duplicate notifications count once.
    this.recordedSlugs.add(slug);
    void this.increment(slug).then(counted => {
      if (!counted) {
        this.recordedSlugs.delete(slug);
        return;
      }
      try {
        this.document.defaultView?.sessionStorage.setItem(storageKey, '1');
      } catch {
        // The in-memory guard still prevents repeat counts during navigation.
      }
    }).catch(error => {
      this.recordedSlugs.delete(slug);
      // Analytics failure must never interrupt reading or navigation.
      console.warn('Could not record page view.', error);
    });
  }

  private async increment(slug: string): Promise<boolean> {
    if (!this.counter) {
      this.counter = this.loadCounter()
        .catch(error => {
          this.counter = undefined;
          throw error;
        });
    }
    const count = await this.counter;
    if (this.devMode.isDevMode()) return false;
    await count(slug);
    return true;
  }
}
