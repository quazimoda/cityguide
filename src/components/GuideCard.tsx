import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/types/content';
import { categorySlugByTitle } from '@/lib/content';
import { ImageCredit } from './ImageCredit';
import { TagList } from './TagList';

export function GuideCard({ guide }: { guide: Article }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-orange-100">
      <Link href={`/guides/${categorySlugByTitle(guide.category)}/${guide.slug}`} className="relative block aspect-[4/3]">
        <Image src={guide.heroImage.src} alt={guide.heroImage.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
      </Link>
      <div className="p-6">
        <ImageCredit image={guide.heroImage} className="mb-3" />
        <p className="text-sm font-bold text-teal-700">{guide.category}</p>
        <h3 className="mt-2 text-xl font-black"><Link href={`/guides/${categorySlugByTitle(guide.category)}/${guide.slug}`}>{guide.title}</Link></h3>
        <p className="my-4 text-gray-600">{guide.excerpt}</p>
        <TagList tags={guide.tags} />
      </div>
    </article>
  );
}
