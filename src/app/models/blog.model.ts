export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  books?: string[]; // ISBN-10 values for associated recommended books
  draft?: boolean;
  shareImage?: string;
}
