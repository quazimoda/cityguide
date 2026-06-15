import type { ImageAsset } from './media';
export type ContentSection = { heading: string; body: string[] };
export type Category = { title: string; slug: string; description: string; gradient: string };
export type Article = { title: string; slug: string; excerpt: string; category: string; publishedDate: string; readingTime: string; tags: string[]; heroImage: ImageAsset; sections: ContentSection[]; seoDescription: string; qualityLevel?: 'draft' | 'reviewed' | 'pillar'; lastReviewedAt?: string; editorialNote?: string; sourceNotes?: string[] };
export type Recommendation = { title: string; slug: string; excerpt: string; category: string; tags: string[]; area: string; link: string; gradient: string };
