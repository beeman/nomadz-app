import { FC, ChangeEvent } from 'react';
import { 
  validateCardNumber, 
  validateCardExpiry, 
  validateCardCvc,
  formatCardNumber,
  formatCardExpiry 
} from '../../utils/validation';

interface CustomCardInputProps {
  cardHolderName?: string;
  onCardHolderNameChange?: (value: string) => void;
  onChange: (event: { 
    elementType: 'cardNumber' | 'cardExpiry' | 'cardCvc';
    complete: boolean;
    error?: { message: string };
    value: string;
  }) => void;
  errors?: {
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
  };
  showCardHolderName?: boolean;
}

export const CustomCardInput: FC<CustomCardInputProps> = ({
  cardHolderName = '',
  onCardHolderNameChange,
  onChange,
  errors = {
    cardNumber: undefined,
    cardExpiry: undefined,
    cardCvc: undefined
  },
  showCardHolderName = false
}) => {
  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = formatCardNumber(e.target.value);
    e.target.value = value;
    
    const error = validateCardNumber(value);
    onChange({
      elementType: 'cardNumber',
      complete: !error,
      error: error ? { message: error } : undefined,
      value
    });
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = formatCardExpiry(e.target.value);
    e.target.value = value;
    
    if (value.endsWith('/')) {
      e.target.value = e.target.value.substring(0, e.target.value.length - 1)
    }
    
    const error = validateCardExpiry(value);
    onChange({
      elementType: 'cardExpiry',
      complete: !error,
      error: error ? { message: error } : undefined,
      value
    });
  };

  const handleCvcChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    e.target.value = value;
    
    const error = validateCardCvc(value);
    onChange({
      elementType: 'cardCvc',
      complete: !error,
      error: error ? { message: error } : undefined,
      value
    });
  };

  return (
    <>
      {/* Card Holder Name - Only shown if showCardHolderName is true */}
      {showCardHolderName && (
        <div className="mb-5 space-y-3">
          <label className="block text-sm text-[#ABABAB]">card holder name</label>
          <input
            type="text"
            defaultValue={cardHolderName}
            onChange={(e) => onCardHolderNameChange?.(e.target.value)}
            className="w-full p-3 text-xs text-white bg-[#101010] rounded-[3px] focus:outline-none focus:ring-1 focus:ring-white/60 border border-[#4E4E4E]"
            placeholder="Name Surname"
          />
        </div>
      )}

      {/* Card Number */}
      <div className="mb-5 space-y-3">
        <label className="block text-sm text-[#ABABAB]">card number</label>
        <div className="px-3 py-2 bg-[#101010] rounded-[3px] border border-[#4E4E4E] focus-within:border-white/60">
          <input
            type="text"
            maxLength={19}
            onChange={handleCardNumberChange}
            className="w-full text-xs text-white bg-transparent focus:outline-none"
            placeholder="1234 5678 9012 3456"
          />
        </div>
        {errors.cardNumber && (
          <p className="text-sm text-red-500">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          <label className="block text-sm text-[#ABABAB]">expire date</label>
          <div className="px-3 py-2 bg-[#101010] rounded-[3px] border border-[#4E4E4E] focus-within:border-white/60">
            <input
              type="text"
              maxLength={5}
              onChange={handleExpiryChange}
              className="w-full text-xs text-white bg-transparent focus:outline-none"
              placeholder="MM/YY"
            />
          </div>
          {errors.cardExpiry && (
            <p className="text-sm text-red-500">{errors.cardExpiry}</p>
          )}
        </div>
        <div className="space-y-3">
          <label className="block text-sm text-[#ABABAB]">security code</label>
          <div className="px-3 py-2 bg-[#101010] rounded-[3px] border border-[#4E4E4E] focus-within:border-white/60">
            <input
              type="text"
              maxLength={3}
              onChange={handleCvcChange}
              className="w-full text-xs text-white bg-transparent focus:outline-none"
              placeholder="123"
            />
          </div>
          {errors.cardCvc && (
            <p className="text-sm text-red-500">{errors.cardCvc}</p>
          )}
        </div>
      </div>
    </>
  );
};
