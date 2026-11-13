import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Personality } from '../../data/periods';
import { ArticleSummary } from '../../models/article.model';
import { LocaleService } from '../../i18n/locale.service';
import { PersonalityChapterImage, PersonalityMilestone, PersonalityProfile, PersonalityProfilesService } from '../../services/personality-profiles.service';
import { articleRoute } from '../../utils/article-route';
import { ArticleSectionLinksComponent } from '../article-section-links/article-section-links.component';
import { localizeContentLinks } from '../../i18n/content-urls';

@Component({
  selector: 'app-personality-profile',
  imports: [RouterLink, ArticleSectionLinksComponent],
  templateUrl: './personality-profile.component.html',
  styleUrls: ['./personality-profile.component.css', './personality-life-story.css', './personality-story-images.css'],
})
export class PersonalityProfileComponent implements OnChanges {
  @Input({ required: true }) personality!: Personality;
  @Input() articles: ArticleSummary[] = [];
  readonly locale = inject(LocaleService);
  private readonly profiles = inject(PersonalityProfilesService);
  readonly profile = signal<PersonalityProfile | null>(null);
  readonly articleRoute = articleRoute;
  readonly showAll = signal(false);
  readonly selectedImage = signal<PersonalityChapterImage | null>(null);
  private requestId = 0;

  async ngOnChanges(): Promise<void> {
    const id = ++this.requestId;
    this.showAll.set(false);
    this.profile.set(null);
    const profile = await this.profiles.get(this.personality.slug).catch(() => undefined);
    if (profile?.story) {
      const html = (source: string) => localizeContentLinks(source, this.locale.language, !!profile.story?.draft, this.locale.basePath, this.locale.offline);
      profile.story = { ...profile.story, introHtml: html(profile.story.introHtml), sourcesHtml: html(profile.story.sourcesHtml),
        chapters: profile.story.chapters.map(chapter => ({ ...chapter, html: html(chapter.html) })) };
    }
    if (id === this.requestId) this.profile.set(profile || null);
  }

  eventDate(event: PersonalityMilestone): string {
    if (event.date) return event.date;
    if (event.year === undefined) return '';
    const number = (year: number) => new Intl.NumberFormat(this.locale.language, { useGrouping: false }).format(Math.abs(year));
    const years = number(event.year) + (event.until !== undefined ? '–' + number(event.until) : '');
    const era = this.locale.translate(event.year < 0 ? 'BCE' : 'CE');
    const date = ['zh', 'ja', 'ko'].includes(this.locale.language) ? `${era} ${years}` : `${years} ${era}`;
    return `${event.approximate ? this.locale.translate('c.') + ' ' : ''}${date}`;
  }

  articleParams(draft = false, chapter?: string): Record<string, string | boolean | null> {
    return { lang: this.locale.language, fromPersonality: this.personality.slug, dev: draft ? true : null,
      ...(chapter ? { fromPersonalityChapter: chapter } : {}) };
  }

  webp(src: string): string { return src.replace(/\.(?:jpe?g|png)$/i, '.webp'); }

  openImage(image: PersonalityChapterImage, dialog: HTMLDialogElement): void {
    this.selectedImage.set(image);
    dialog.showModal();
  }
}
