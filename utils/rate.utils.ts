import { COMMISSION_PERCENTAGE } from "../constants/commission";

// Utility function to calculate commission amount
export const calculateCommission = (baseAmount: number): number => {
  return 0; // (baseAmount * COMMISSION_PERCENTAGE) / 100;
};

// Utility function to add commission to an amount
export const addCommission = (baseAmount: number): number => {
  return baseAmount; // + calculateCommission(baseAmount);
};

// Utility function to calculate total price with commission using backend formula
// totalPrice = (basePrice * (10_000 + feePercentage * 100) / 10_000) + taxPrice
export const calculateTotalPriceWithCommission = (baseAmount: number, taxAmount: number = 0): number => {
  // const feePercentage = COMMISSION_PERCENTAGE;
  // const totalWithCommission = (baseAmount * (10000 + feePercentage * 100)) / 10000;
  // return totalWithCommission + taxAmount;
  return baseAmount;
};

/**
 * Calculates the price with commission for a single rate
 * @param rate - Single rate object
 * @returns Price with commission or 0 if no valid payment details
 */
export const getPriceWithCommission = (rate: any): number => {
  const paymentDetails = rate?.payment_options?.payment_types?.[0];

  if (!paymentDetails?.show_amount) {
    return 0;
  }

  const originalAmount = Number(paymentDetails.show_amount);

  // Calculate taxes for the commission formula
  const taxes = paymentDetails?.tax_data?.taxes || [];
  const totalTaxes = taxes.reduce((sum: number, tax: any) => {
    if (tax.currency_code === paymentDetails?.show_currency_code) {
      return sum + Number(tax.amount);
    }
    return sum;
  }, 0);

  // Use backend formula: totalPrice = (basePrice * (10_000 + feePercentage * 100) / 10_000) + taxPrice
  const totalWithCommission = calculateTotalPriceWithCommission(originalAmount, totalTaxes);

  return Number(totalWithCommission.toFixed(2));
};

/**
 * Calculates the lowest price with commission for an apartment/rate
 * @param rates - Array of rates for the apartment
 * @returns Formatted price with commission or 0 if no rates available
 */
export const getLowestPriceWithCommission = (rates: any[]): number => {
  if (!rates || rates.length === 0) {
    return 0;
  }

  return getPriceWithCommission(rates[0]);
};

/**
 * Formats a price with 2 decimal places
 * @param price - The price to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Calculates the nightly price with commission for a single rate
 * @param rate - Single rate object
 * @returns Nightly price with commission or 0 if no valid payment details
 */
export const getNightlyPriceWithCommission = (rate: any): number => {
  if (!rate) return 0;
  // Use daily_prices if available and non-empty
  if (Array.isArray(rate.daily_prices) && rate.daily_prices.length > 0) {
    // Sum all daily prices, convert to number, and average
    const total = rate.daily_prices.reduce((sum: number, price: string | number) => sum + Number(price), 0);
    const avg = total / rate.daily_prices.length;
    // Add commission to nightly price
    return addCommission(avg);
  }
  // Fallback to old logic (total price divided by nights if possible)
  const paymentDetails = rate?.payment_options?.payment_types?.[0];
  if (paymentDetails?.show_amount && rate.nights) {
    return addCommission(Number(paymentDetails.show_amount) / rate.nights);
  }
  return 0;
}; 