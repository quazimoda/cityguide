import Link from 'next/link';

import { Container } from './Container';
import { HeroVideoBackground } from './HeroVideoBackground';
import { SafeImage } from './SafeImage';
import type { ImageAsset } from '@/types/media';

type HeroCta = {
  label: string;
  href: string;
};

type HeroVideo = {
  src: string;
  poster: string;
};

type HeroProps = {
  title: string;
  subtitle: string;
  image?: ImageAsset;
  video?: HeroVideo;
  ctas?: HeroCta[];
};

export function Hero({ title, subtitle, image, video, ctas }: HeroProps) {
  if (video || image) {
    return (
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 -z-10">
          {video ? (
            <HeroVideoBackground src={video.src} poster={video.poster} />
          ) : image ? (
            <SafeImage
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/94 via-slate-950/68 to-slate-950/34" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/86 via-slate-950/18 to-slate-950/34" />
        </div>
        <Container className="flex min-h-[540px] items-center py-20 md:min-h-[620px] md:py-24">
          <div className="max-w-4xl">
            <p className="mb-3 font-bold uppercase tracking-widest text-orange-200">City Advisor Istanbul</p>
            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/86 md:text-xl">
              {subtitle}
            </p>
            {ctas && ctas.length > 0 ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {ctas.map((cta, index) => (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className={
                      index === 0
                        ? 'rounded-full bg-orange-500 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-400'
                        : 'rounded-full border border-white/55 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white backdrop-blur transition hover:bg-white/20'
                    }
                  >
                    {cta.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-orange-100 via-white to-teal-100">
      <Container className="py-16">
        <p className="mb-3 font-bold uppercase tracking-widest text-orange-600">City Advisor Istanbul</p>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-teal-950 md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-700">{subtitle}</p>
      </Container>
    </section>
  );
}
