/**
 * Format price to Ghana Cedis currency
 * @param {number|string} price - The price to format
 * @returns {string} Formatted price with GH₵ symbol
 */
export const formatPrice = (price) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `GH₵${numPrice.toFixed(2)}`;
};

/**
 * Currency symbol for Ghana Cedis
 */
export const CURRENCY_SYMBOL = 'GH₵';
