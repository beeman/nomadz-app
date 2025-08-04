import { useAtom, useAtomValue } from 'jotai';
import {
  paymentsAtom,
  paymentsLoadingAtom,
  paymentsErrorAtom,
  createPaymentAtom,
  fetchPaymentsAtom,
} from '../storage/payment.storage';

export const usePayments = () => {
  const [payments, setPayments] = useAtom(paymentsAtom);
  const isLoading = useAtomValue(paymentsLoadingAtom);
  const error = useAtomValue(paymentsErrorAtom);
  const [, createPayment] = useAtom(createPaymentAtom);
  const [, fetchPayments] = useAtom(fetchPaymentsAtom);

  return {
    payments,
    isLoading,
    error,
    createPayment,
    fetchPayments,
  };
}; 