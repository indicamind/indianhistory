import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LocaleService } from '../i18n/locale.service';
import { DevModeService } from './dev-mode.service';

export interface PersonalityLifeStory {
  title: string;
  introHtml: string;
  chapters: { id: string; date: string; title: string; html: string; articles: { slug: string; title: string }[] }[];
  sourcesHtml: string;
  draft?: boolean;
}

export interface PersonalityMilestone {
  title: string;
  year?: number;
  until?: number;
  approximate?: boolean;
  date?: string;
  article?: string;
  articleTitle?: string;
}

export interface PersonalityProfile {
  events: PersonalityMilestone[];
  paragraphs?: string[];
  article?: { slug: string; title: string };
  image?: { src: string; alt: string; credit: string; landscape: boolean; kind: string; author: string; license: string; sourceUrl: string; licenseUrl?: string };
  sources: { author: string; url: string }[];
  story?: PersonalityLifeStory;
}

@Injectable({ providedIn: 'root' })
export class PersonalityProfilesService {
  private readonly http = inject(HttpClient);
  private readonly locale = inject(LocaleService);
  private readonly devMode = inject(DevModeService);
  private request?: Promise<Record<string, PersonalityProfile>>;
  private draftRequest?: Promise<Record<string, PersonalityLifeStory>>;

  async get(slug: string): Promise<PersonalityProfile | undefined> {
    const language = this.locale.language === 'en' ? '' : this.locale.language + '/';
    this.request ??= firstValueFrom(this.http.get<Record<string, PersonalityProfile>>(
      `${this.locale.generatedAssetsBase}${language}personality-profiles.json`
    )).catch(error => { this.request = undefined; throw error; });
    const profile = (await this.request)[slug];
    if (!profile || !this.devMode.isDevMode() || this.locale.language !== 'en' || this.locale.offline) return profile;
    this.draftRequest ??= firstValueFrom(this.http.get<Record<string, PersonalityLifeStory>>(
      `${this.locale.generatedAssetsBase}personality-story-drafts.json`
    )).catch(() => ({}));
    const story = (await this.draftRequest)[slug];
    return story ? { ...profile, story } : profile;
  }
}
