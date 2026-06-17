import Link from 'next/link';
import type { Article } from '@/types/content';
import { ImageCredit } from './ImageCredit';
import { SafeImage } from './SafeImage';
import { TagList } from './TagList';

export function BlogCard({ post }: { post: Article }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-teal-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-950/10">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden focus:outline-none focus:ring-4 focus:ring-orange-300">
        <SafeImage src={post.heroImage.src} alt={post.heroImage.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent opacity-70 transition group-hover:opacity-90" />
      </Link>
      <div className="p-6">
        <ImageCredit image={post.heroImage} className="mb-3" />
        <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">{post.readingTime} · {post.publishedDate}</p>
        <h3 className="mt-2 text-xl font-black text-slate-950"><Link className="transition hover:text-teal-700" href={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p className="my-4 text-sm leading-6 text-gray-600">{post.excerpt}</p>
        <TagList tags={post.tags} />
      </div>
    </article>
  );
}
