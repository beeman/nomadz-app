import { FC, useEffect, useState } from 'react';
import { 
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { cardElementStyle } from '../../styles/stripe.styles';
import { useStripeService } from '../../hooks/stripe.hooks';
import CreditCard from './CreditCard';
import toastNotifications from '../../utils/toastNotifications.utils';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useApartments } from '../../hooks/booking/apartment.hooks';
import { LoadingIcon } from '../../components/icons/Icons';
import { useProcessBooking } from '../../services/payment';

interface PaymentCardElementProps {
  total: number;
  guests: {
    adults: number;
    children: number[];
  };
  bookHash: string;
  onSuccess?: () => void;
}

/**
 * A component that handles credit card payments using Stripe Elements.
 * Renders a payment form with fields for card number, expiration date, and CVC.
 * Processes the payment for the specified total amount when submitted.
 * Optionally allows saving the card for future use if saveCard is enabled.
 * 
 * @param {number} total - The total amount to charge in the payment
 */

export const PaymentCardElement: FC<PaymentCardElementProps> = ({ total, guests, bookHash, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const { paymentMethods, fetchPaymentMethods, createPaymentIntent } = useStripeService();
  const { selectedApartment } = useApartments();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false
  });
  const processBooking = useProcessBooking();

  // Set showNewCardForm to true if no payment methods available
  useEffect(() => {
    if (Array.isArray(paymentMethods)) {
      setShowNewCardForm(paymentMethods.length ? false : true);
    }
  }, [paymentMethods]);

  // Fetch payment methods
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleChange = (event: any) => {
    if (event.error) {
      setErrors(prev => ({
        ...prev,
        [event.elementType]: event.error.message
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[event.elementType];
        return newErrors;
      });
    }

    // Track completion status
    setIsComplete(prev => ({
      ...prev,
      [event.elementType]: event.complete
    }));
  };

  const createStripePaymentIntent = async () => {
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    let paymentIntent;
    if (!showNewCardForm && selectedPaymentMethod) {
      // Pay with existing payment method
      paymentIntent = await createPaymentIntent({
        amount: Math.round(total * 100),
        paymentMethodId: selectedPaymentMethod,
      });
    } else {
      // Pay with new card
      const cardNumber = elements?.getElement(CardNumberElement);
      if (!cardNumber) {
        throw new Error('Card element not found');
      }

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber,
        billing_details: {
          name: cardHolderName,
        },
      });

      if (pmError) {
        throw pmError;
      }

      paymentIntent = await createPaymentIntent({
        amount: Math.round(total * 100),
        paymentMethodId: paymentMethod.id,
        setupFutureUsage: saveCard,
      });
    }

    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      throw new Error('Payment failed');
    }

    return paymentIntent;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe) return;

    try {
      setIsLoading(true);
      await processBooking({
        bookHash,
        guests,
        hid: selectedApartment.hid,
        onPayment: () => createStripePaymentIntent()
      });
      onSuccess?.();
      toastNotifications.success('Booking successful');
    } catch (error: any) {
      toastNotifications.error(error.message || 'Booking failed');
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = !showNewCardForm 
    ? !!selectedPaymentMethod 
    : cardHolderName.trim() !== '' && 
      isComplete.cardNumber && 
      isComplete.cardExpiry && 
      isComplete.cardCvc && 
      Object.keys(errors).length === 0;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <p className="mb-8 text-xl">payment</p>

      {/* Saved Payment Methods */}
      {paymentMethods.length > 0 && !showNewCardForm && (
        <>
          <div className="mb-6 space-y-4 max-h-[268px] overflow-y-auto no-scrollbar">
            {paymentMethods.map(method => (
              <label key={method.id} className="block cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="hidden"
                />
                <div className='m-1'>
                  <CreditCard
                    className={`transition-all ${
                      selectedPaymentMethod === method.id 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#101010]' 
                        : ''
                    }`}
                    name={method.card.brand.toUpperCase()}
                    last4={method.card.last4}
                    showDelete={false}
                  />
                </div>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowNewCardForm(true)}
            className="text-sm text-[#8A8A8A] hover:text-white flex items-center space-x-1.5"
          >
            <PlusIcon className="size-4" /> <span>pay with a new card</span>
          </button>
        </>
      )}

      {/* New Card Form */}
      {(!paymentMethods.length || showNewCardForm) && (
        <>
          {showNewCardForm && !!paymentMethods.length && (
            <button
              type="button"
              onClick={() => {
                setShowNewCardForm(false);
                setSelectedPaymentMethod(null);
              }}
              className="mb-6 text-sm text-[#8A8A8A] hover:text-white"
            >
              ← back to saved cards
            </button>
          )}

          {/* Card Holder Name */}
          <div className="mb-6 space-y-2">
            <label className="block text-[#8A8A8A]">Card Holder Name</label>
            <input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              className="w-full px-4 py-3 text-white bg-[#1B1B1B] rounded-xl test-xl focus:outline-none focus:ring-1 focus:ring-white/60"
              placeholder="Name Surname"
            />
          </div>

          {/* Card Number */}
          <div className="mb-6 space-y-2">
            <label className="block text-[#8A8A8A]">card number</label>
            <div className="px-4 py-3 bg-[#1B1B1B] rounded-lg border border-[#2F2F2F] focus-within:border-white/60">
              <CardNumberElement
                onChange={handleChange}
                options={{ style: cardElementStyle }}
              />
            </div>
            {errors.cardNumber && (
              <p className="text-sm text-red-500">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="block text-[#8A8A8A]">expire date</label>
              <div className="px-4 py-3 bg-[#1B1B1B] rounded-lg border border-[#2F2F2F] focus-within:border-white/60">
                <CardExpiryElement
                  onChange={handleChange}
                  options={{ style: cardElementStyle }}
                />
              </div>
              {errors.cardExpiry && (
                <p className="text-sm text-red-500">{errors.cardExpiry}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-[#8A8A8A]">security code</label>
              <div className="px-4 py-3 bg-[#1B1B1B] rounded-lg border border-[#2F2F2F] focus-within:border-white/60">
                <CardCvcElement
                  onChange={handleChange}
                  options={{ style: cardElementStyle }}
                />
              </div>
              {errors.cardCvc && (
                <p className="text-sm text-red-500">{errors.cardCvc}</p>
              )}
            </div>
          </div>

          {/* Save Card Checkbox */}
          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="w-4 h-4 rounded border-[#2F2F2F] bg-[#1B1B1B] focus:ring-white/60"
                // setup_future_usage
              />
              <span className="text-sm text-[#8A8A8A]">save card details</span>
            </label>
          </div>

          {/* Privacy Notice */}
          <p className="mt-6 text-xs text-[#8A8A8A]">
            your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
          </p>
        </>
      )}

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full mt-6 !py-3 text-white bg-transparent rounded-lg border-gradient-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <LoadingIcon className="size-6 animate-spin" />
          </div>
        ) : (
          'pay'
        )}
      </button>
    </form>
  );
}; 