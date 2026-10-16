import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { MustReadComponent } from './components/must-read/must-read.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { HomeComponent } from './pages/home/home.component';
import { PeriodDetailComponent } from './pages/period-detail/period-detail.component';
import { SearchComponent } from './pages/search/search.component';
import { ArticleService } from './services/article.service';
import { articleRoute } from './utils/article-route';

const canonicalArticleGuard: CanActivateFn = async route => {
  const articles = inject(ArticleService);
  const router = inject(Router);
  await articles.whenReady();
  const article = articles.getBySlug(route.paramMap.get('slug') ?? '');
  return article?.period === 'world-history'
    ? router.createUrlTree(articleRoute(article), { queryParams: route.queryParams })
    : true;
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'blogs/:slug', component: BlogDetailComponent },
  { path: 'books', component: MustReadComponent },
  { path: 'search', component: SearchComponent },
  { path: 'worldhistory/:eventSlug/:slug', component: ArticleDetailComponent },
  { path: 'worldhistory/:slug', component: ArticleDetailComponent },
  { path: 'article/:slug', component: ArticleDetailComponent, canActivate: [canonicalArticleGuard] },
  { path: 'post/:slug', redirectTo: 'article/:slug', pathMatch: 'full' },
  { path: 'period/:slug', component: PeriodDetailComponent },
  { path: 'polity/:slug', component: PeriodDetailComponent },
  { path: 'theme/:slug', component: PeriodDetailComponent },
  { path: 'personality/:slug', component: PeriodDetailComponent },
  { path: 'dev', redirectTo: () => '/?dev=true', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
