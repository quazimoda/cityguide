import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { TagList } from '@/components/TagList';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { ArticleHeroImage } from '@/components/ArticleHeroImage';
import { KittenHunt } from '@/components/KittenHunt';
import { categories } from '@/data/categories';
import { guides } from '@/data/guides';
import { getExperienceOfferForContext } from '@/data/offers';
import { getCategory, getGuide } from '@/lib/content';
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, JsonLd } from '@/lib/seo';

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export function generateStaticParams() {
  return categories.flatMap((category) =>
    guides
      .filter((guide) => guide.category === category.title)
      .map((guide) => ({ category: category.slug, slug: guide.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const guide = getGuide(category, slug);

  if (!guide) {
    return { title: 'Guide not found' };
  }

  return articleMetadata(guide, `/guides/${category}/${guide.slug}`);
}

export default async function GuideDetail({ params }: PageProps) {
  const { category, slug } = await params;
  const guideCategory = getCategory(category);
  const guide = getGuide(category, slug);

  if (!guideCategory || !guide) {
    notFound();
  }

  const offer = getExperienceOfferForContext(`${guide.slug} ${guide.category} ${guide.tags.join(' ')}`);
  const breadcrumbItems = [
    { label: 'Guides', href: '/guides' },
    { label: guideCategory.title, href: `/guides/${guideCategory.slug}` },
    { label: guide.title },
  ];

  return (
    <Container className="py-8">
      <JsonLd data={articleJsonLd(guide, `/guides/${guideCategory.slug}/${guide.slug}`)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <article className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <p className="font-bold text-orange-600">
            {guide.category} · {guide.readingTime}
          </p>
          <h1 className="mt-3 text-4xl font-black text-teal-950">{guide.title}</h1>
          <p className="my-5 text-lg text-gray-600">{guide.excerpt}</p>
          <TagList tags={guide.tags} />
          <ArticleHeroImage image={guide.heroImage} priority />
          <div className="article mt-8">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
        <AdPlaceholder offer={offer} sourceArticleSlug={guide.slug} sourceLabel={guide.title} />
      </article>
      <KittenHunt />
    </Container>
  );
}
