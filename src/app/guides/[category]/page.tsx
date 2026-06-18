import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { Hero } from '@/components/Hero';
import { GuideCard } from '@/components/GuideCard';
import { categories } from '@/data/categories';
import { getCategory, getGuidesByCategory } from '@/lib/content';

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const guideCategory = getCategory(category);

  if (!guideCategory) {
    return { title: 'Guides' };
  }

  return {
    title: guideCategory.title,
    description: guideCategory.description,
    alternates: { canonical: `/guides/${guideCategory.slug}` },
    openGraph: {
      title: `${guideCategory.title} Guides`,
      description: guideCategory.description,
      url: `/guides/${guideCategory.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${guideCategory.title} Guides`,
      description: guideCategory.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const guideCategory = getCategory(category);

  if (!guideCategory) {
    notFound();
  }

  const items = getGuidesByCategory(category);

  return (
    <>
      <Hero title={guideCategory.title} subtitle={guideCategory.description} />
      <Container className="grid gap-5 py-12 md:grid-cols-2">
        {items.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </Container>
    </>
  );
}
