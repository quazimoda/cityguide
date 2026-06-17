import type React from 'react';

export function HorizontalCardScroller({ children }: { children: React.ReactNode }) {
  return <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">{children}</div>;
}
