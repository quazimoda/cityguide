import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/types/content';
import { ImageCredit } from './ImageCredit';
import { TagList } from './TagList';

export function BlogCard({ post }: { post: Article }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-teal-100">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3]">
        <Image src={post.heroImage.src} alt={post.heroImage.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
      </Link>
      <div className="p-6">
        <ImageCredit image={post.heroImage} className="mb-3" />
        <p className="text-sm font-bold text-orange-600">{post.readingTime} · {post.publishedDate}</p>
        <h3 className="mt-2 text-xl font-black"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p className="my-4 text-gray-600">{post.excerpt}</p>
        <TagList tags={post.tags} />
      </div>
    </article>
  );
}
