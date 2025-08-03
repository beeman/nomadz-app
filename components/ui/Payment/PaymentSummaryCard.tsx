import { FC, useState, useMemo, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentCardElement } from './PaymentCardElement';
import { PaymentWalletElement } from './PaymentWalletElement';
import { elementsAppearance } from '../../styles/stripe.styles';
import { CURRENCIES } from '../../constants';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentSummaryCardProps {
  property: any;
  nights: number;
  subtotal: number;
  fee: number;
  total: number;
  guests: {
    adults: number;
    children: number[];
  };
  bookHash: string;
  currencyCode: string;
  onSuccess?: () => void;
}

const PaymentSummaryCard: FC<PaymentSummaryCardProps> = ({
  property,
  nights,
  subtotal,
  fee,
  total,
  guests,
  bookHash,
  currencyCode,
  onSuccess,
}) => {
  const [isPaymentMode, setIsPaymentMode] = useState(true);
  const [paymentType, setPaymentType] = useState<'crypto' | 'fiat' | null>('crypto');

  const stripeElementsOptions = useMemo(
    () => ({
      mode: 'payment' as const,
      currency: currencyCode?.toLowerCase(),
      amount: Math.round(total * 100),
      appearance: elementsAppearance,
    }),
    [total, currencyCode],
  );

  const currencyChar = CURRENCIES.find(c => c.code === currencyCode)?.char;

  const handlePayFiatClick = () => {
    setIsPaymentMode(true);
    setPaymentType('fiat');
  };

  const handlePayCryptoClick = () => {
    setIsPaymentMode(true);
    setPaymentType('crypto');
  };

  const OrderSummary = () => (
    <div className='max-lg:order-first divide-y divide-[#353535]'>
      <p className='mb-4 text-lg font-semibold'>order summary</p>

      {/* Property Info */}
      <div className='flex gap-4 py-8'>
        <img
          src={property.images[0].url?.replace('{size}', '100x100')}
          alt={property.name}
          className='object-cover w-[54px] h-[54px] rounded-xl'
        />
        <div className='flex justify-between w-full space-x-8'>
          <div className='space-y-1'>
            <div className='text-sm font-medium'>{property.name}</div>
            <div className='text-[#8A8A8A] text-xs'>
              {property.address?.full || property.address}
            </div>
          </div>
          <div className='space-y-1 max-[400px]:hidden'>
            <div className='text-sm text-white'>
              {currencyChar}
              {subtotal.toFixed(2)}
            </div>
            <div className='text-[#8A8A8A] text-xs'>nights: {nights}</div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className='pt-6 mb-8 space-y-4'>
        <div className='flex justify-between text-xs'>
          <span>subtotal</span>
          <span>
            {currencyChar}
            {subtotal.toFixed(2)}
          </span>
        </div>
        <div className='flex justify-between text-xs'>
          <span>fees & taxes</span>
          <span>
            {currencyChar}
            {fee.toFixed(2)}
          </span>
        </div>
      </div>

      <div className='flex justify-between pt-6 font-medium'>
        <span className='text-xs'>total</span>
        <span className='text-xl lg:text-2xl'>
          {currencyChar}
          {total.toFixed(2)}
        </span>
      </div>
    </div>
  );

  return (
    <div className='grid gap-6 lg:gap-12 w-full px-4 sm:px-24 py-12 sm:py-32 text-white bg-[#101010] rounded-3xl lg:grid-cols-2 border border-[#2F2F2F] max-h-[calc(100dvh-80px)] overflow-y-auto no-scrollbar'>
      {isPaymentMode ? (
        <>
          {paymentType === 'fiat' ? (
            <Elements stripe={stripePromise} options={stripeElementsOptions}>
              <PaymentCardElement
                total={total}
                guests={guests}
                bookHash={bookHash}
                onSuccess={onSuccess}
              />
            </Elements>
          ) : (
            <PaymentWalletElement
              total={total}
              guests={guests}
              bookHash={bookHash}
              onSuccess={onSuccess}
            />
          )}
          <OrderSummary />
        </>
      ) : (
        <>
          <OrderSummary />
          <div className='flex flex-col justify-between pt-16 lg:px-20'>
            {/* Payment Buttons */}
            <div className='flex flex-col max-lg:gap-6 md:max-lg:flex-row md:max-lg:space-x-4 lg:gap-10'>
              <button
                onClick={handlePayCryptoClick}
                // disabled={true}
                className='disabled:opacity-30 w-full !py-2.5 text-white rounded-lg border-gradient-primary before:rounded-lg font-bold text-sm'
              >
                Pay Crypto
              </button>
              {/* <button
                onClick={handlePayFiatClick}
                className='w-full py-2 text-sm font-bold text-white border-2 border-white rounded-lg before:rounded-lg'
              >
                Pay Fiat
              </button> */}
            </div>

            {/* Privacy Notice */}
            <p className='text-xs text-[#ACACAC] max-lg:!mt-6'>
              Your personal data will be used to process your order, support your experience
              throughout this website, and for other purposes described in our privacy policy.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentSummaryCard;
