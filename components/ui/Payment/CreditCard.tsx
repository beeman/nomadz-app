import { FC } from 'react';
import { XRectangleIcon, VisaIcon, MastercardIcon } from '../icons/Icons';

interface CreditCardProps {
  name: string;
  last4: string;
  onDelete?: () => void;
  showDelete?: boolean;
  className?: string;
}

const CreditCard: FC<CreditCardProps> = ({ 
  name, 
  last4, 
  onDelete,
  showDelete = true,
  className = ''
}) => {
  const getCardIcon = () => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('visa')) {
      return <VisaIcon className="size-8" />;
    }
    if (lowercaseName.includes('mastercard')) {
      return <MastercardIcon className="size-8" />;
    }
    return null;
  };

  return (
    <div className={`flex items-start justify-between p-2 bg-[#1B1B1B] rounded-xl ${className}`}>
      <div className="flex items-center justify-between w-full gap-1 p-2">
        <div className="flex items-center gap-2">
          {getCardIcon() || name}
        </div>
        <span className="text-xs text-white">•••• •••• •••• {last4}</span>
      </div>
      {showDelete && onDelete && (
        <button 
          className="text-[#A9A9A9] hover:text-white"
          onClick={onDelete}
        >
          <XRectangleIcon className="size-3 text-[#CA5555]" />
        </button>
      )}
    </div>
  );
};

export default CreditCard;