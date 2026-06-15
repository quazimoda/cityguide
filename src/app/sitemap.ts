import type { MetadataRoute } from 'next';
import { categories } from '@/data/categories';
import { guides } from '@/data/guides';
import { blogPosts } from '@/data/blog';
import { categorySlugByTitle } from '@/lib/content';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  return ['', '/about', '/guides', '/blog', '/search', '/contact']
    .map((path) => ({ url: `${baseUrl}${path}`, lastModified: now }))
    .concat(
      categories.map((category) => ({
        url: `${baseUrl}/guides/${category.slug}`,
        lastModified: now
      })),
      guides.map((guide) => ({
        url: `${baseUrl}/guides/${categorySlugByTitle(guide.category)}/${guide.slug}`,
        lastModified: new Date(guide.publishedDate)
      })),
      blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishedDate)
      }))
    );
}
