import { DatePipe, DOCUMENT } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { BlogPost } from '../../models/blog.model';
import { LocaleService } from '../../i18n/locale.service';
import { BlogService } from '../../services/blog.service';
import { localizeContentLinks } from '../../i18n/content-urls';
import { AssociatedBooksComponent } from '../../components/associated-books/associated-books.component';
import { BookRecommendationsService } from '../../services/book-recommendations.service';
import { DevModeService } from '../../services/dev-mode.service';
import { PageViewService } from '../../services/page-view.service';

@Component({
  selector: 'app-blog-detail',
  imports: [DatePipe, RouterLink, AssociatedBooksComponent],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css',
})
export class BlogDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly blogs = inject(BlogService);
  private readonly pageViews = inject(PageViewService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly document = inject(DOCUMENT);
  private readonly recommendations = inject(BookRecommendationsService);
  readonly devMode = inject(DevModeService);
  readonly locale = inject(LocaleService);
  private requestId = 0;
  private lastCountedSlug: string | null = null;
  private previousBodyOverflow: string | null = null;
  @ViewChild('imageDialog') private imageDialog?: ElementRef<HTMLDialogElement>;

  readonly post = signal<BlogPost | null>(null);
  readonly bottomBooks = computed(() => this.recommendations.forBlog(this.post(), this.devMode.isDevMode()).below);
  readonly html = signal<SafeHtml | null>(null);
  readonly htmlParts = signal<SafeHtml[]>([]);
  readonly loading = signal(true);
  readonly selectedImage = signal<{ src: string; alt: string; caption: string } | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => this.restoreImageScroll());
  }

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async ([params]) => {
      const requestId = ++this.requestId;
      this.imageDialog?.nativeElement.close();
      this.imageClosed();
      this.loading.set(true);
      await this.blogs.whenReady();
      if (requestId !== this.requestId) return;
      const post = this.blogs.getBySlug(params.get('slug') ?? '') ?? null;
      this.post.set(post);
      const html = post ? localizeContentLinks(post.html, this.locale.language, post.draft, this.locale.basePath, this.locale.offline) : null;
      this.html.set(html ? this.sanitizer.bypassSecurityTrustHtml(this.imageButtons(html)) : null);
      if (post) {
        const offsets = post.bookInsertionOffsets ?? [post.html.length, post.html.length];
        const boundaries = [0, ...offsets, post.html.length];
        this.htmlParts.set(boundaries.slice(1).map((end, index) => this.sanitizer.bypassSecurityTrustHtml(this.imageButtons(
          localizeContentLinks(post.html.slice(boundaries[index], end), this.locale.language, post.draft, this.locale.basePath, this.locale.offline)
        ))));
      } else {
        this.htmlParts.set([]);
      }
      this.loading.set(false);
      if (post && !post.draft && post.slug !== this.lastCountedSlug) this.pageViews.record(post.slug);
      this.lastCountedSlug = post?.slug ?? null;
    });
  }

  openImage(event: MouseEvent, dialog: HTMLDialogElement): void {
    if (!(event.target instanceof Element)) return;
    const image = event.target.closest('.blog-image-trigger')?.querySelector('img');
    if (!image) return;
    event.preventDefault();
    this.selectedImage.set({
      src: image.src,
      alt: image.alt,
      caption: image.closest('figure')?.querySelector('figcaption')?.innerText.replace(/\s+/g, ' ').trim() || image.alt,
    });
    if (!dialog.open) {
      this.previousBodyOverflow = this.document.body.style.overflow;
      this.document.body.style.overflow = 'hidden';
      dialog.showModal();
    }
  }

  imageClosed(): void {
    this.selectedImage.set(null);
    this.restoreImageScroll();
  }

  private restoreImageScroll(): void {
    if (this.previousBodyOverflow !== null) {
      this.document.body.style.overflow = this.previousBodyOverflow;
      this.previousBodyOverflow = null;
    }
  }

  private imageButtons(html: string): string {
    if (!/<img\b/i.test(html)) return html;
    const label = this.locale.translate('View image').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return html
      .replace(/<a\b[^>]*>\s*(<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>)\s*<\/a>/gi, '$1')
      .replace(/<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>/gi, image => {
        const alt = image.match(/\balt="([^"]*)"/i)?.[1];
        return `<button type="button" class="blog-image-trigger" aria-label="${label}${alt ? `: ${alt}` : ''}">${image}</button>`;
      });
  }
}
