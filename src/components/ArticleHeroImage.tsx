import type { ImageAsset } from '@/types/media';
import { ImageCredit } from './ImageCredit';
import { SafeImage } from './SafeImage';

export function ArticleHeroImage({ image, priority = false }: { image: ImageAsset; priority?: boolean }) {
  const isEditorialImage =
    image.source === 'City Advisor Istanbul' || image.src === '/images/advisor-ferry-shot-hero.webp';

  return (
    <figure className="mt-6 overflow-hidden rounded-3xl bg-orange-50 shadow-sm ring-1 ring-orange-100">
      {isEditorialImage ? (
        <div className="relative h-[72vh] min-h-[440px] max-h-[780px] overflow-hidden bg-teal-950">
          <SafeImage
            src={image.src}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 760px, 100vw"
            className="scale-110 object-cover opacity-45 blur-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-950/45 via-slate-950/20 to-orange-950/35" />
          <div className="relative mx-auto flex h-full max-w-[560px] items-center justify-center px-4 py-6 sm:px-8">
            <SafeImage
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 560px, 92vw"
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      ) : (
        <div className="relative aspect-[16/9]">
          <SafeImage
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 760px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <figcaption className="bg-white px-4 py-3">
        <ImageCredit image={image} />
      </figcaption>
    </figure>
  );
}
