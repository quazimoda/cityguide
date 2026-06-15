import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { TagList } from '@/components/TagList';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { ArticleHeroImage } from '@/components/ArticleHeroImage';
import { blogPosts } from '@/data/blog';
import { getBlogPost } from '@/lib/content';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
    <Container className="py-8">
      <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />
      <article className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <p className="font-bold text-orange-600">
            {post.category} · {post.readingTime} · {post.publishedDate}
          </p>
          <h1 className="mt-3 text-4xl font-black text-teal-950">{post.title}</h1>
          <p className="my-5 text-lg text-gray-600">{post.excerpt}</p>
          <TagList tags={post.tags} />
          <ArticleHeroImage image={post.heroImage} priority />
          <div className="article mt-8">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
          <AdPlaceholder />
        </div>
        <AdPlaceholder />
      </article>
    </Container>
  );
}
