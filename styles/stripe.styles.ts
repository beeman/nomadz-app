import type { StripeElementStyle, Appearance } from '@stripe/stripe-js';

export const cardElementStyle: StripeElementStyle = {
  base: {
    fontSize: '16px',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    fontSmoothing: 'antialiased',
    '::placeholder': {
      color: '#808080',
    },
    iconColor: '#fff',
  },
  invalid: {
    color: '#EF4444',
    iconColor: '#EF4444',
  },
};

export const elementsAppearance: Appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#0570de',
    colorBackground: '#1B1B1B',
    colorText: '#ffffff',
    colorDanger: '#EF4444',
    fontFamily: 'Arial, sans-serif',
  },
};