'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type HeroVideoBackgroundProps = {
  src: string;
  poster: string;
};

export function HeroVideoBackground({ src, poster }: HeroVideoBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  if (prefersReducedMotion) {
    return (
      <div aria-hidden="true" className="relative h-full w-full">
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <video
      aria-hidden="true"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className="hero-flight-video h-full w-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
