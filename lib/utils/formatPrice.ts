import type { Money } from '@/lib/catalog';

/**
 * Format a Money object into a human-readable dual-currency string.
 * e.g. { kes: 12500, usd: 100 } → "KES 12,500 / USD 100"
 * Returns "On request" when both values are 0.
 */
export function formatPrice(price: Money): string {
  if (price.kes === 0 && price.usd === 0) return 'On request';

  const kes = `KES ${price.kes.toLocaleString('en-KE')}`;
  const usd = `USD ${price.usd.toLocaleString('en-US')}`;
  return `${kes} / ${usd}`;
}

/**
 * Format only the KES portion.
 */
export function formatKes(price: Money): string {
  if (price.kes === 0) return 'On request';
  return `KES ${price.kes.toLocaleString('en-KE')}`;
}

/**
 * Format only the USD portion.
 */
export function formatUsd(price: Money): string {
  if (price.usd === 0) return 'On request';
  return `USD ${price.usd.toLocaleString('en-US')}`;
}

/**
 * Safe helper for components that may have string | Money (legacy data).
 */
export function safeFormatPrice(price: string | Money): string {
  if (typeof price === 'string') return price;
  return formatPrice(price);
}
