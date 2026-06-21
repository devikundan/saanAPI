export enum BlogStatus {
  Draft = 0,
  Published = 1,
  Archived = 2
}

export interface BlogListResponse {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  featuredImageUrl: string | null;
  author: string;
  tags: string | null;
  publishedAt: string | null;
}

export interface BlogResponse {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  featuredImageUrl: string | null;
  author: string;
  tags: string | null;
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
