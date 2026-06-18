'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useState } from 'react';

type SafeImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  style?: CSSProperties;
};

export function SafeImage({ src, alt, fill = false, sizes, className = '', priority = false, style }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 via-teal-950 to-orange-900 px-6 text-center text-white">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-100/80">City Advisor Istanbul</p>
          <p className="mt-2 text-sm font-medium text-white/75">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      style={style}
      onError={() => setHasError(true)}
    />
  );
}
