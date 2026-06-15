import type { ImageAsset } from '@/types/media';

export function ImageCredit({ image, className = '' }: { image: ImageAsset; className?: string }) {
  return (
    <p className={`text-xs text-gray-500 ${className}`}>
      Photo by{' '}
      <a className="font-semibold underline-offset-2 hover:underline" href={image.photographerUrl} rel="noreferrer" target="_blank">
        {image.photographer}
      </a>{' '}
      on{' '}
      <a className="font-semibold underline-offset-2 hover:underline" href={image.sourceUrl} rel="noreferrer" target="_blank">
        {image.source}
      </a>
    </p>
  );
}
