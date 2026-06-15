import Image from 'next/image';
import type { ImageAsset } from '@/types/media';
import { ImageCredit } from './ImageCredit';

export function ArticleHeroImage({ image, priority = false }: { image: ImageAsset; priority?: boolean }) {
  return (
    <figure className="mt-6 overflow-hidden rounded-3xl bg-orange-50 shadow-sm ring-1 ring-orange-100">
      <div className="relative aspect-[16/9]">
        <Image src={image.src} alt={image.alt} fill priority={priority} sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
      </div>
      <figcaption className="bg-white px-4 py-3">
        <ImageCredit image={image} />
      </figcaption>
    </figure>
  );
}
