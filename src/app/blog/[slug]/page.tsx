import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { TagList } from '@/components/TagList';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { ArticleHeroImage } from '@/components/ArticleHeroImage';
import { ImageCredit } from '@/components/ImageCredit';
import { KittenHunt } from '@/components/KittenHunt';
import { SafeImage } from '@/components/SafeImage';
import { blogPosts } from '@/data/blog';
import { getExperienceOfferForContext } from '@/data/offers';
import { getBlogPost } from '@/lib/content';
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, JsonLd } from '@/lib/seo';

type PageProps = {
  params: Promise<{ slug: string }>;
};


export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: 'Blog post not found' };
  }

  return articleMetadata(post, `/blog/${post.slug}`);
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const offer = getExperienceOfferForContext(`${post.slug} ${post.category} ${post.tags.join(' ')}`);
  const breadcrumbItems = [{ label: 'Blog', href: '/blog' }, { label: post.title }];

  return (
    <Container className='py-8'>
      <JsonLd data={articleJsonLd(post, `/blog/${post.slug}`)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
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
            {post.sections.map((section) => (
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
              </section>
            ))}
          </div>
        </div>
        <AdPlaceholder offer={offer} sourceArticleSlug={post.slug} sourceLabel={post.title} />
      </article>
      <KittenHunt />
    </Container>
  );
}
