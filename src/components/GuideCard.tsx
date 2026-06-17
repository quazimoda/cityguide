import Link from 'next/link';
import type { Article } from '@/types/content';
import { categorySlugByTitle } from '@/lib/content';
import { ImageCredit } from './ImageCredit';
import { SafeImage } from './SafeImage';
import { TagList } from './TagList';

export function GuideCard({ guide }: { guide: Article }) {
  const href = `/guides/${categorySlugByTitle(guide.category)}/${guide.slug}`;
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-orange-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-950/10">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden focus:outline-none focus:ring-4 focus:ring-orange-300">
        <SafeImage src={guide.heroImage.src} alt={guide.heroImage.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent opacity-70 transition group-hover:opacity-90" />
      </Link>
      <div className="p-6">
        <ImageCredit image={guide.heroImage} className="mb-3" />
        <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">{guide.category}</p>
        <h3 className="mt-2 text-xl font-black text-slate-950"><Link className="transition hover:text-orange-600" href={href}>{guide.title}</Link></h3>
        <p className="my-4 text-sm leading-6 text-gray-600">{guide.excerpt}</p>
        <TagList tags={guide.tags} />
      </div>
    </article>
  );
}
