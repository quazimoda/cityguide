import type { MetadataRoute } from 'next';
import { categories } from '@/data/categories';
import { guides } from '@/data/guides';
import { blogPosts } from '@/data/blog';
import { categorySlugByTitle } from '@/lib/content';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  return ['', '/about', '/guides', '/blog', '/search', '/contact']
    .map((path) => ({ url: base + path, lastModified: new Date() }))
    .concat(
      categories.map((category) => ({
        url: `${base}/guides/${category.slug}`,
        lastModified: new Date()
      })),
      guides.map((guide) => ({
        url: `${base}/guides/${categorySlugByTitle(guide.category)}/${guide.slug}`,
        lastModified: new Date(guide.publishedDate)
      })),
      blogPosts.map((post) => ({
        url: `${base}/blog/${post.slug}`,
        lastModified: new Date(post.publishedDate)
      }))
    );
}
