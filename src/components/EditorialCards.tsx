import Link from 'next/link';

import { SafeImage } from './SafeImage';
import type { ImageAsset } from '@/types/media';

type FeatureCardProps = {
  title: string;
  description: string;
  href: string;
  image: ImageAsset;
  eyebrow?: string;
  className?: string;
};

export function EditorialFeatureCard({ title, description, href, image, eyebrow, className = '' }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex min-h-[340px] overflow-hidden rounded-[2rem] bg-slate-900 p-6 text-white shadow-sm ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-950/20 focus:outline-none focus:ring-4 focus:ring-orange-300 ${className}`}
    >
      <SafeImage src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
      <div className="relative mt-auto max-w-lg">
        {eyebrow ? <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-orange-200">{eyebrow}</p> : null}
        <h3 className="text-2xl font-black tracking-tight md:text-3xl">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/84">{description}</p>
        <span className="mt-5 inline-flex items-center rounded-full bg-white/14 px-4 py-2 text-sm font-bold backdrop-blur transition group-hover:bg-orange-500">
          Explore <span className="ml-2 transition group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

type MiniCardProps = FeatureCardProps & { meta?: string };

export function ImageCard({ title, description, href, image, eyebrow, meta }: MiniCardProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-950/10 focus:outline-none focus:ring-4 focus:ring-orange-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 85vw" className="object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent opacity-70 transition group-hover:opacity-90" />
        {eyebrow ? <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-wider text-teal-900">{eyebrow}</span> : null}
      </div>
      <div className="p-5">
        {meta ? <p className="text-xs font-black uppercase tracking-widest text-orange-600">{meta}</p> : null}
        <h3 className="mt-2 text-xl font-black text-slate-950 transition group-hover:text-teal-800">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </Link>
  );
}
