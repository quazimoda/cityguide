export const KITTEN_FOUND_COUNT_KEY = 'istanbulKittenFoundCount';
export const KITTEN_DISCOUNT_PERCENT_KEY = 'istanbulKittenDiscountPercent';

export const KITTEN_DISCOUNT_STEP_PERCENT = 5;
export const KITTEN_DISCOUNT_MAX_PERCENT = 20;

let memoryFoundCount = 0;

export function calculateKittenDiscountPercent(foundCount: number) {
  if (!Number.isFinite(foundCount) || foundCount <= 0) {
    return 0;
  }

  return Math.min(
    Math.floor(foundCount) * KITTEN_DISCOUNT_STEP_PERCENT,
    KITTEN_DISCOUNT_MAX_PERCENT,
  );
}

function getSafeFoundCount(foundCount: number) {
  return Number.isFinite(foundCount) && foundCount > 0 ? Math.floor(foundCount) : 0;
}

function getMemoryKittenDiscountState() {
  const foundCount = getSafeFoundCount(memoryFoundCount);
  const discountPercent = calculateKittenDiscountPercent(foundCount);

  return { foundCount, discountPercent };
}

function readStoredFoundCount() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const storedValue = window.localStorage.getItem(KITTEN_FOUND_COUNT_KEY);
    const parsedValue = Number.parseInt(storedValue ?? '0', 10);

    return getSafeFoundCount(parsedValue);
  } catch {
    return undefined;
  }
}

export function readKittenDiscountState() {
  const storedFoundCount = readStoredFoundCount();

  if (storedFoundCount === undefined) {
    return getMemoryKittenDiscountState();
  }

  memoryFoundCount = storedFoundCount;

  return {
    foundCount: storedFoundCount,
    discountPercent: calculateKittenDiscountPercent(storedFoundCount),
  };
}

export function storeKittenDiscountState(foundCount: number) {
  const safeFoundCount = getSafeFoundCount(foundCount);
  const discountPercent = calculateKittenDiscountPercent(safeFoundCount);

  memoryFoundCount = safeFoundCount;

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(KITTEN_FOUND_COUNT_KEY, String(safeFoundCount));
      window.localStorage.setItem(KITTEN_DISCOUNT_PERCENT_KEY, String(discountPercent));
    } catch {
      // Keep the in-memory fallback updated so the current page session continues safely.
    }
  }

  return { foundCount: safeFoundCount, discountPercent };
}

export function recordKittenFound() {
  const { foundCount } = readKittenDiscountState();

  return storeKittenDiscountState(foundCount + 1);
}
