import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { supportsViewCounting } from '../config/firebase.config';
import { DevModeService } from './dev-mode.service';

@Injectable({ providedIn: 'root' })
export class PageViewService {
  private readonly document = inject(DOCUMENT);
  private readonly devMode = inject(DevModeService);
  private counter?: Promise<(slug: string) => Promise<unknown>>;

  record(slug: string): void {
    const href = this.document.location?.href;
    if (!href || this.devMode.isDevMode() || !supportsViewCounting(new URL(href))) return;
    void this.increment(slug).catch(error => {
      // Analytics failure must never interrupt reading or navigation.
      console.warn('Could not record page view.', error);
    });
  }

  private async increment(slug: string): Promise<void> {
    if (!this.counter) {
      this.counter = import('./page-view-client')
        .then(client => client.createViewCounter())
        .catch(error => {
          this.counter = undefined;
          throw error;
        });
    }
    const count = await this.counter;
    if (!this.devMode.isDevMode()) await count(slug);
  }
}
