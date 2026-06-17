export const KITTEN_FOUND_COUNT_KEY = 'istanbulKittenFoundCount';
export const KITTEN_DISCOUNT_PERCENT_KEY = 'istanbulKittenDiscountPercent';

export const KITTEN_DISCOUNT_STEP_PERCENT = 5;
export const KITTEN_DISCOUNT_MAX_PERCENT = 20;

export function calculateKittenDiscountPercent(foundCount: number) {
  if (!Number.isFinite(foundCount) || foundCount <= 0) {
    return 0;
  }

  return Math.min(
    Math.floor(foundCount) * KITTEN_DISCOUNT_STEP_PERCENT,
    KITTEN_DISCOUNT_MAX_PERCENT,
  );
}

function readStoredNumber(key: string) {
  if (typeof window === 'undefined') {
    return 0;
  }

  const storedValue = window.localStorage.getItem(key);
  const parsedValue = Number.parseInt(storedValue ?? '0', 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0;
}

export function readKittenDiscountState() {
  const foundCount = readStoredNumber(KITTEN_FOUND_COUNT_KEY);
  const discountPercent = calculateKittenDiscountPercent(foundCount);

  return { foundCount, discountPercent };
}

export function storeKittenDiscountState(foundCount: number) {
  if (typeof window === 'undefined') {
    return { foundCount: 0, discountPercent: 0 };
  }

  const safeFoundCount = Math.max(0, Math.floor(foundCount));
  const discountPercent = calculateKittenDiscountPercent(safeFoundCount);

  window.localStorage.setItem(KITTEN_FOUND_COUNT_KEY, String(safeFoundCount));
  window.localStorage.setItem(KITTEN_DISCOUNT_PERCENT_KEY, String(discountPercent));

  return { foundCount: safeFoundCount, discountPercent };
}

export function recordKittenFound() {
  const { foundCount } = readKittenDiscountState();

  return storeKittenDiscountState(foundCount + 1);
}
