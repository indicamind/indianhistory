export interface BlogPost {
  slug: string;
  viewCount?: number; // Firestore snapshot embedded during the production build
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
