export const KITTEN_FOUND_COUNT_KEY = 'istanbulKittenFoundCount';
export const KITTEN_DISCOUNT_PERCENT_KEY = 'istanbulKittenDiscountPercent';
export const KITTEN_DISCOUNT_EXPIRES_AT_KEY = 'istanbulKittenDiscountExpiresAt';

export const KITTEN_DISCOUNT_STEP_PERCENT = 5;
export const KITTEN_DISCOUNT_MAX_PERCENT = 20;
export const KITTEN_DISCOUNT_TTL_MS = 60 * 60 * 1000;

let memoryFoundCount = 0;
let memoryExpiresAt = 0;

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

function getSafeExpiresAt(expiresAt: number) {
  return Number.isFinite(expiresAt) && expiresAt > 0 ? Math.floor(expiresAt) : 0;
}

function isExpired(expiresAt: number, now = Date.now()) {
  return expiresAt > 0 && expiresAt <= now;
}

function resetMemoryKittenDiscountState() {
  memoryFoundCount = 0;
  memoryExpiresAt = 0;

  return { foundCount: 0, discountPercent: 0, expiresAt: 0 };
}

function removeStoredKittenDiscountState() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(KITTEN_FOUND_COUNT_KEY);
    window.localStorage.removeItem(KITTEN_DISCOUNT_PERCENT_KEY);
    window.localStorage.removeItem(KITTEN_DISCOUNT_EXPIRES_AT_KEY);
  } catch {
    // Storage cleanup is best-effort only.
  }
}

function getMemoryKittenDiscountState() {
  const foundCount = getSafeFoundCount(memoryFoundCount);
  const expiresAt = getSafeExpiresAt(memoryExpiresAt);

  if (foundCount > 0 && isExpired(expiresAt)) {
    return resetMemoryKittenDiscountState();
  }

  return { foundCount, discountPercent: calculateKittenDiscountPercent(foundCount), expiresAt };
}

function readStoredValue(key: string) {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return undefined;
  }
}

export function readKittenDiscountState() {
  const storedFoundCountValue = readStoredValue(KITTEN_FOUND_COUNT_KEY);

  if (storedFoundCountValue === undefined) {
    return getMemoryKittenDiscountState();
  }

  const storedFoundCount = getSafeFoundCount(Number.parseInt(storedFoundCountValue ?? '0', 10));
  const storedExpiresAt = getSafeExpiresAt(
    Number.parseInt(readStoredValue(KITTEN_DISCOUNT_EXPIRES_AT_KEY) ?? '0', 10),
  );

  if (storedFoundCount > 0 && isExpired(storedExpiresAt)) {
    removeStoredKittenDiscountState();
    return resetMemoryKittenDiscountState();
  }

  memoryFoundCount = storedFoundCount;
  memoryExpiresAt = storedFoundCount > 0 ? storedExpiresAt : 0;

  return {
    foundCount: storedFoundCount,
    discountPercent: calculateKittenDiscountPercent(storedFoundCount),
    expiresAt: memoryExpiresAt,
  };
}

export function storeKittenDiscountState(foundCount: number, expiresAt = Date.now() + KITTEN_DISCOUNT_TTL_MS) {
  const safeFoundCount = getSafeFoundCount(foundCount);
  const safeExpiresAt = safeFoundCount > 0 ? getSafeExpiresAt(expiresAt) : 0;
  const discountPercent = calculateKittenDiscountPercent(safeFoundCount);

  memoryFoundCount = safeFoundCount;
  memoryExpiresAt = safeExpiresAt;

  if (typeof window !== 'undefined') {
    try {
      if (safeFoundCount <= 0) {
        window.localStorage.removeItem(KITTEN_FOUND_COUNT_KEY);
        window.localStorage.removeItem(KITTEN_DISCOUNT_PERCENT_KEY);
        window.localStorage.removeItem(KITTEN_DISCOUNT_EXPIRES_AT_KEY);
      } else {
        window.localStorage.setItem(KITTEN_FOUND_COUNT_KEY, String(safeFoundCount));
        window.localStorage.setItem(KITTEN_DISCOUNT_PERCENT_KEY, String(discountPercent));
        window.localStorage.setItem(KITTEN_DISCOUNT_EXPIRES_AT_KEY, String(safeExpiresAt));
      }
    } catch {
      // Keep the in-memory fallback updated so the current page session continues safely.
    }
  }

  return { foundCount: safeFoundCount, discountPercent, expiresAt: safeExpiresAt };
}

export function recordKittenFound() {
  const { foundCount } = readKittenDiscountState();

  return storeKittenDiscountState(foundCount + 1, Date.now() + KITTEN_DISCOUNT_TTL_MS);
}
