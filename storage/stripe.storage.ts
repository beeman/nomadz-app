import { atom } from 'jotai';
import { api } from '../utils/api';
import { authenticatedUserAtom } from './auth.storage';
import { ActionCreatorOptions } from '../types/action.types';
import { Stripe } from '@stripe/stripe-js';

interface PaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export const stripeErrorsAtom = atom({
  setupIntent: null,
  confirmSetup: null,
  fetchPaymentMethods: null,
  deletePaymentMethod: null,
});

export const paymentMethodsAtom = atom<PaymentMethod[]>([]);

export const fetchPaymentMethodsAtom = atom(
  (get) => get(paymentMethodsAtom),
  async (get, set, options?: ActionCreatorOptions) => {
    set(stripeErrorsAtom, { ...get(stripeErrorsAtom), fetchPaymentMethods: null });
    const customerId = get(authenticatedUserAtom)?.userBillingProfile?.stripeCustomerId;

    if (!customerId) {
      throw new Error('No Stripe customer ID found');
    }

    try {
      const response = await api.get(`stripe/customers/${customerId}/payment-methods`);
      set(paymentMethodsAtom, response.data);
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      options?.onError?.(error);
      set(stripeErrorsAtom, { ...get(stripeErrorsAtom), fetchPaymentMethods: error?.response?.data });
    }
  }
);

export const deletePaymentMethodAtom = atom(
  null,
  async (get, set, paymentMethodId: string, options?: ActionCreatorOptions) => {
    set(stripeErrorsAtom, { ...get(stripeErrorsAtom), deletePaymentMethod: null });

    try {
      await api.delete(`stripe/payment-methods/${paymentMethodId}`);

      // Update the payment methods list after successful deletion
      const currentMethods = get(paymentMethodsAtom);
      set(paymentMethodsAtom, currentMethods.filter(method => method.id !== paymentMethodId));

      options?.onSuccess?.();
    } catch (error: any) {
      options?.onError?.(error);
      set(stripeErrorsAtom, { ...get(stripeErrorsAtom), deletePaymentMethod: error?.response?.data });
    }
  }
);

export const createSetupIntentAtom = atom(
  null,
  async (get, set, options?: ActionCreatorOptions) => {
    set(stripeErrorsAtom, { ...get(stripeErrorsAtom), setupIntent: null });
    const customerId = get(authenticatedUserAtom)?.userBillingProfile?.stripeCustomerId;

    if (!customerId) {
      throw new Error('No Stripe customer ID found');
    }

    try {
      const response = await api.post(`stripe/${customerId}/setup-intent`, {
        paymentMethodTypes: ['card'],
      });
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      options?.onError?.(error);
      set(stripeErrorsAtom, { ...get(stripeErrorsAtom), setupIntent: error?.response?.data });
    }
  }
);

export const confirmCardSetupAtom = atom(
  null,
  async (
    get,
    set,
    params: {
      stripe: Stripe;
      clientSecret: string;
      cardElement: any;
      cardHolderName: string;
    },
    options?: ActionCreatorOptions
  ) => {
    set(stripeErrorsAtom, { ...get(stripeErrorsAtom), confirmSetup: null });
    const { stripe, clientSecret, cardElement, cardHolderName } = params;

    try {
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardHolderName,
          },
        }
      });

      if (result.error) {
        throw result.error;
      }

      options?.onSuccess?.(result);
      return result;
    } catch (error: any) {
      options?.onError?.(error);
      set(stripeErrorsAtom, { ...get(stripeErrorsAtom), confirmSetup: error });
    }
  }
);

export const createPaymentIntentAtom = atom(
  null,
  async (get, set, params: {
    amount: number;
    paymentMethodId: string;
    setupFutureUsage?: boolean;
  }, options?: ActionCreatorOptions) => {
    try {
      const response = await api.post('stripe/payment-intents', {
        amount: params.amount,
        customerId: get(authenticatedUserAtom)?.userBillingProfile?.stripeCustomerId,
        paymentMethodId: params.paymentMethodId,
        confirm: true,
        setupFutureUsage: params.setupFutureUsage ? 'off_session' : undefined,
        paymentMethodTypes: [
          "card",
        ],
      });
      
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      options?.onError?.(error);
      set(stripeErrorsAtom, { ...get(stripeErrorsAtom), paymentIntent: error });
    }
  }
); 