import type { ImageAsset } from '@/types/media';
import { ImageCredit } from './ImageCredit';
import { SafeImage } from './SafeImage';

export function ArticleHeroImage({ image, priority = false }: { image: ImageAsset; priority?: boolean }) {
  const isEditorialImage = image.source === 'City Advisor Istanbul';

  return (
    <figure className="mt-6 overflow-hidden rounded-3xl bg-orange-50 shadow-sm ring-1 ring-orange-100">
      <div className={isEditorialImage ? 'relative h-[70vh] min-h-[420px] max-h-[760px] bg-slate-100' : 'relative aspect-[16/9]'}>
        <SafeImage
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 760px, 100vw"
          className={isEditorialImage ? 'object-contain' : 'object-cover'}
        />
      </div>
      <figcaption className="bg-white px-4 py-3">
        <ImageCredit image={image} />
      </figcaption>
    </figure>
  );
}
