import type { Metadata } from 'next';
import Link from 'next/link';
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
      <Container className="py-12">
        {items.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {items.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-orange-100">
            <h2 className="text-2xl font-black text-teal-950">Guides are coming soon</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              We do not have articles in this category yet, but the main guide library has plenty of practical Istanbul planning ideas.
            </p>
            <Link
              href="/guides"
              className="mt-6 inline-flex rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
            >
              Back to all guides
            </Link>
          </div>
        )}
      </Container>
    </>
  );
}
