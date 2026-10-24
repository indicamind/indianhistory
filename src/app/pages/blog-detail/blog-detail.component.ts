import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
  private readonly recommendations = inject(BookRecommendationsService);
  private readonly devMode = inject(DevModeService);
  readonly locale = inject(LocaleService);
  private requestId = 0;
  private lastCountedSlug: string | null = null;

  readonly post = signal<BlogPost | null>(null);
  readonly bottomBooks = computed(() => this.recommendations.forBlog(this.post(), this.devMode.isDevMode()).below);
  readonly html = signal<SafeHtml | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async ([params]) => {
      const requestId = ++this.requestId;
      this.loading.set(true);
      await this.blogs.whenReady();
      if (requestId !== this.requestId) return;
      const post = this.blogs.getBySlug(params.get('slug') ?? '') ?? null;
      this.post.set(post);
      const html = post ? localizeContentLinks(post.html, this.locale.language, post.draft, this.locale.basePath) : null;
      this.html.set(html ? this.sanitizer.bypassSecurityTrustHtml(html) : null);
      this.loading.set(false);
      if (post && !post.draft && post.slug !== this.lastCountedSlug) this.pageViews.record(post.slug);
      this.lastCountedSlug = post?.slug ?? null;
    });
  }
}
