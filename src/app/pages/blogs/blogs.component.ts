import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../models/blog.model';
import { BlogService } from '../../services/blog.service';
import { LocaleService } from '../../i18n/locale.service';
import { ArticleSectionLinksComponent } from '../../components/article-section-links/article-section-links.component';

@Component({
  selector: 'app-blogs',
  imports: [DatePipe, RouterLink, ArticleSectionLinksComponent],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css',
})
export class BlogsComponent implements OnInit {
  private readonly blogsService = inject(BlogService);
  readonly locale = inject(LocaleService);
  readonly loading = signal(true);
  readonly posts = computed<BlogPost[]>(() => this.loading() ? [] : this.blogsService.allPosts());

  async ngOnInit(): Promise<void> {
    await this.blogsService.whenReady();
    this.loading.set(false);
  }
}
