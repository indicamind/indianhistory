import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {LocaleService} from '../i18n/locale.service';
import {DevModeService} from './dev-mode.service';
import {PersonalityProfile} from './personality-profiles.service';

@Injectable({providedIn: 'root'})
export class ThemeStoriesService {
  private readonly http = inject(HttpClient);
  private readonly locale = inject(LocaleService);
  private readonly dev = inject(DevModeService);
  private readonly requests = new Map<string, Promise<Record<string, PersonalityProfile>>>();

  private load(name: string): Promise<Record<string, PersonalityProfile>> {
    const language = this.locale.language === 'en' ? '' : this.locale.language + '/';
    const url = `${this.locale.generatedAssetsBase}${language}${name}.json`;
    if (!this.requests.has(url)) {
      this.requests.set(url, firstValueFrom(this.http.get<Record<string, PersonalityProfile>>(url)).catch(() => {
        this.requests.delete(url);
        return {};
      }));
    }
    return this.requests.get(url)!;
  }

  async get(slug: string): Promise<PersonalityProfile | undefined> {
    const released = (await this.load('theme-stories'))[slug];
    if (!this.dev.isDevMode() || this.locale.offline) return released;
    const preview = (await this.load('theme-story-drafts'))[slug];
    return preview?.story && (!preview.story.draft || this.locale.language === 'en') ? preview : released;
  }
}
