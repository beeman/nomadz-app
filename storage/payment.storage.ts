import { atom } from 'jotai';
import { api } from '../utils/api';
import { resolveUrl } from '../utils/app.utils';
import { authenticatedUserAtom } from './auth.storage';
import { PaymentIntent } from '@stripe/stripe-js';

// Atoms for storing payment data
export const paymentsAtom = atom<any[]>([]);
export const paymentsLoadingAtom = atom<boolean>(false);
export const paymentsErrorAtom = atom<string | null>(null);

// Atom for creating a payment
export const createPaymentAtom = atom(
  null,
  async (get, set, { hid, details }: { hid: string | number, details: PaymentIntent }) => {
    const authenticatedUser = get(authenticatedUserAtom);
    set(paymentsLoadingAtom, true);
    set(paymentsErrorAtom, null);
    
    try {
      const url = resolveUrl('payments', { id: authenticatedUser?.userBillingProfile.id });
      const response = await api.post(url, {
        hid,
        details
      });
      
      const currentPayments = get(paymentsAtom);
      set(paymentsAtom, [...currentPayments, response.data]);
      
      return response.data;
    } catch (error: any) {
      set(paymentsErrorAtom, error.message);
      throw error;
    } finally {
      set(paymentsLoadingAtom, false);
    }
  }
);

// Atom for fetching payments
export const fetchPaymentsAtom = atom(
  null,
  async (get, set) => {
    set(paymentsLoadingAtom, true);
    set(paymentsErrorAtom, null);
    
    try {
      const url = 'payments';
      const response = await api.get(url);
      set(paymentsAtom, response.data);
      return response.data;
    } catch (error: any) {
      set(paymentsErrorAtom, error.message);
      throw error;
    } finally {
      set(paymentsLoadingAtom, false);
    }
  }
); 