// Currency conversion utilities
export const USD_TO_NAIRA_RATE = 1600;

export function formatPriceInNaira(usdPrice: number): string {
  const nairaPrice = usdPrice * USD_TO_NAIRA_RATE;
  return `₦${nairaPrice.toLocaleString()}`;
}

export function convertToNaira(usdAmount: number): number {
  return usdAmount * USD_TO_NAIRA_RATE;
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}
