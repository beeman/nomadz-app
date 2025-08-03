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

    // For now, return the original amount (commission calculation can be added later)
    return originalAmount + totalTaxes;
};

/**
 * Calculates the lowest price with commission for an apartment/rate
 * @param rates - Array of rates for the apartment
 * @returns Price with commission or 0 if no rates available
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
        return avg;
    }

    // Fallback to old logic (total price divided by nights if possible)
    const paymentDetails = rate?.payment_options?.payment_types?.[0];
    if (paymentDetails?.show_amount && rate.nights) {
        return Number(paymentDetails.show_amount) / rate.nights;
    }

    return 0;
}; 