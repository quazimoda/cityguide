import type { Metadata } from 'next';
import type { Article } from '@/types/content';
import { siteConfig } from '@/lib/site';

const publisherName = siteConfig.name;

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString();
}

export function articleMetadata(article: Article, path: string): Metadata {
  const url = absoluteUrl(path);
  const image = article.heroImage?.src ? absoluteUrl(article.heroImage.src) : undefined;

  return {
    title: article.title,
    description: article.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.seoDescription,
      type: 'article',
      url,
      publishedTime: article.publishedDate,
      modifiedTime: article.lastReviewedAt ?? article.publishedDate,
      siteName: publisherName,
      images: image
        ? [
            {
              url: image,
              alt: article.heroImage.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: article.title,
      description: article.seoDescription,
      images: image ? [image] : undefined,
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: publisherName,
    description: siteConfig.description,
    url: absoluteUrl('/'),
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      url: absoluteUrl('/'),
    },
  };
}

export function articleJsonLd(article: Article, path: string) {
  const url = absoluteUrl(path);
  const image = article.heroImage?.src ? absoluteUrl(article.heroImage.src) : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seoDescription,
    datePublished: article.publishedDate,
    dateModified: article.lastReviewedAt ?? article.publishedDate,
    image: image ? [image] : undefined,
    author: {
      '@type': 'Organization',
      name: publisherName,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      url: absoluteUrl('/'),
    },
    url,
  };
}

export function breadcrumbJsonLd(items: Array<{ label: string; href?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? absoluteUrl(item.href) : undefined,
    })),
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
