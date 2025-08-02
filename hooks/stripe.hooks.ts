import { useAtom } from 'jotai';
import {
  createSetupIntentAtom,
  confirmCardSetupAtom,
  stripeErrorsAtom,
  fetchPaymentMethodsAtom,
  deletePaymentMethodAtom,
  createPaymentIntentAtom,
} from '../storage/stripe.storage';

export const useStripeService = () => {
  const [paymentMethods, fetchPaymentMethods] = useAtom(fetchPaymentMethodsAtom);
  const [_setupIntent, createSetupIntent] = useAtom(createSetupIntentAtom);
  const [_confirmSetup, confirmCardSetup] = useAtom(confirmCardSetupAtom);
  const [_deletePaymentMethod, deletePaymentMethod] = useAtom(deletePaymentMethodAtom);
  const [errors] = useAtom(stripeErrorsAtom);
  const [_paymentIntent, createPaymentIntent] = useAtom(createPaymentIntentAtom);

  return {
    paymentMethods,
    fetchPaymentMethods,
    createSetupIntent,
    confirmCardSetup,
    deletePaymentMethod,
    errors,
    createPaymentIntent,
  };
}; 