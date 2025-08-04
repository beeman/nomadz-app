import { FC, ReactNode } from 'react';

interface CustomButtonProps {
  icon?: ReactNode;
  label: string;
  value?: string;
  defaultText?: string;
  className?: string;
  onClick?: () => void;
  hasBorder?: boolean;
}

const CustomButton: FC<CustomButtonProps> = ({
  icon,
  label,
  value,
  defaultText = 'Add',
  className = '',
  onClick,
}) => (
  <button className={`flex items-center space-x-2 h-min text-white ${className}`} onClick={onClick}>
    {icon && (
      <div className={`size-6 text-[#A9A9A9]`}>
        {icon}
      </div>
    )}
    <div className='flex flex-col items-start'>
      <span className='text-sm font-semibold whitespace-nowrap'>{label}</span>
      <span className='text-xs text-[#A9A9A9]'>{value || `${defaultText}`}</span>
    </div>
  </button>
);

export default CustomButton;