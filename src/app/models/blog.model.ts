export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  draft?: boolean;
  shareImage?: string;
}
