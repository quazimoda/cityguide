import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { TagList } from '@/components/TagList';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { ArticleHeroImage } from '@/components/ArticleHeroImage';
import { ImageCredit } from '@/components/ImageCredit';
import { SafeImage } from '@/components/SafeImage';
import { ExcursionOrderCta } from '@/components/ExcursionOrderCta';
import { blogPosts } from '@/data/blog';
import { getBlogPost } from '@/lib/content';

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getExcursionCtaProps(slug: string, heading: string) {
  if (slug === 'how-to-capture-the-viral-istanbul-ferry-shot') {
    if (heading === 'How to Take the Photo') {
      return { variant: 'inline' as const, ctaLabel: undefined, title: 'Want help capturing your own ferry shot?' };
    }
    if (heading === 'Final Thoughts') {
      return { variant: 'card' as const, ctaLabel: undefined, title: undefined };
    }
  }

  if (slug === 'istanbul-for-first-time-visitors' && heading === 'Day 1 evening: ferry or Bosphorus view') {
    return { variant: 'compact' as const, ctaLabel: 'Book the ferry photo experience', title: 'Want help capturing the ferry part of your Istanbul route?' };
  }

  if (slug === 'how-to-use-public-transportation-in-istanbul' && heading === 'Ferry: transport and city experience') {
    return { variant: 'compact' as const, ctaLabel: 'Book the ferry photo experience', title: 'Turn your ferry crossing into a photo experience.' };
  }

  if (slug === 'istanbul-without-emptying-your-wallet' && heading === '6. Instead of a tourist Bosphorus cruise, take the public ferry') {
    return { variant: 'compact' as const, ctaLabel: 'Book the ferry photo experience', title: 'Make one low-cost ferry ride feel cinematic.' };
  }

  return null;
}


export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  return {
    title: post?.title,
    description: post?.seoDescription,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <Container className='py-8'>
      <Breadcrumbs
        items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      />
      <article className='grid gap-8 lg:grid-cols-[1fr_300px]'>
        <div>
          <p className='font-bold text-orange-600'>
            {post.category} · {post.readingTime} · {post.publishedDate}
          </p>
          <h1 className='mt-3 text-4xl font-black text-teal-950'>
            {post.title}
          </h1>
          <p className='my-5 text-lg text-gray-600'>{post.excerpt}</p>
          <TagList tags={post.tags} />
          <ArticleHeroImage image={post.heroImage} priority />
          <div className='article mt-8'>
            {post.sections.map((section) => {
              const ctaProps = getExcursionCtaProps(post.slug, section.heading);

              return (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.image ? (
                    <figure className='not-prose my-7 overflow-hidden rounded-2xl bg-orange-50 shadow-sm ring-1 ring-orange-100'>
                      <div className='relative aspect-[16/9]'>
                        <SafeImage
                          src={section.image.src}
                          alt={section.image.alt}
                          fill
                          sizes='(min-width: 1024px) 760px, 100vw'
                          className='object-cover'
                        />
                      </div>
                      <figcaption className='bg-white px-4 py-3'>
                        <ImageCredit image={section.image} />
                      </figcaption>
                    </figure>
                  ) : null}
                  {ctaProps ? (
                    <div className='not-prose'>
                      <ExcursionOrderCta
                        {...ctaProps}
                        sourceArticleSlug={post.slug}
                        sourceLabel={`${post.title} — ${section.heading}`}
                      />
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
          <AdPlaceholder />
        </div>
        <AdPlaceholder />
      </article>
    </Container>
  );
}
