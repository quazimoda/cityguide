'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  readKittenDiscountState,
  recordKittenFound,
} from '@/lib/kittenDiscount';

type KittenSpot = {
  bottom?: string;
  left?: string;
  right?: string;
  top?: string;
};

const KITTEN_SPOTS: KittenSpot[] = [
  { top: '18%', right: '1rem' },
  { top: '38%', left: '0.75rem' },
  { bottom: '7rem', right: '1.25rem' },
  { bottom: '5.5rem', left: '1rem' },
];

function getRandomInteger(minimum: number, maximum: number) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

export function KittenHunt() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenFoundOnPage, setHasBeenFoundOnPage] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [spotIndex] = useState(() => getRandomInteger(0, KITTEN_SPOTS.length - 1));
  const kittenSpot = useMemo(() => KITTEN_SPOTS[spotIndex], [spotIndex]);

  useEffect(() => {
    setDiscountPercent(readKittenDiscountState().discountPercent);

    const delay = getRandomInteger(3000, 6000);
    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setToastMessage('');
    }, 3800);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  function handleFindKitten() {
    const nextState = recordKittenFound();

    setDiscountPercent(nextState.discountPercent);
    setIsVisible(false);
    setHasBeenFoundOnPage(true);
    setToastMessage(
      `You found the Istanbul kitten! Your trip discount is now ${nextState.discountPercent}%.`,
    );
  }

  return (
    <>
      {discountPercent > 0 ? (
        <div className="fixed bottom-4 right-4 z-40 rounded-full bg-teal-950/90 px-3 py-2 text-xs font-bold text-white shadow-lg ring-1 ring-white/30 md:bottom-5 md:right-5">
          Kitten discount: {discountPercent}%
        </div>
      ) : null}

      {toastMessage ? (
        <div
          aria-live="polite"
          className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-teal-950 shadow-xl ring-1 ring-orange-200"
        >
          {toastMessage}
        </div>
      ) : null}

      {isVisible && !hasBeenFoundOnPage ? (
        <button
          aria-label="Find the Istanbul kitten"
          className="kitten-hunt-button fixed z-30 grid h-12 w-12 place-items-center rounded-full bg-orange-50/95 text-2xl shadow-lg ring-1 ring-orange-200 transition hover:-translate-y-0.5 hover:scale-105 hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-300"
          onClick={handleFindKitten}
          style={kittenSpot}
          type="button"
        >
          <span aria-hidden="true" className="kitten-hunt-icon">
            🐈
          </span>
        </button>
      ) : null}
    </>
  );
}
