import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogPost } from '../../models/blog.model';
import { LocaleService } from '../../i18n/locale.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css',
})
export class BlogDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly blogs = inject(BlogService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly locale = inject(LocaleService);
  private requestId = 0;

  readonly post = signal<BlogPost | null>(null);
  readonly html = signal<SafeHtml | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async params => {
      const requestId = ++this.requestId;
      this.loading.set(true);
      await this.blogs.whenReady();
      if (requestId !== this.requestId) return;
      const post = this.blogs.getBySlug(params.get('slug') ?? '') ?? null;
      this.post.set(post);
      const html = post?.html.replace(/href="(\/article\/[a-z0-9-]+)"/g,
        `href="$1?lang=${this.locale.language}"`);
      this.html.set(html ? this.sanitizer.bypassSecurityTrustHtml(html) : null);
      this.loading.set(false);
    });
  }
}
