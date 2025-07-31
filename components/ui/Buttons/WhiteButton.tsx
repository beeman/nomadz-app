import { FC, ReactNode } from 'react';

interface WhiteButtonProps {
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  prefixIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

const WhiteButton: FC<WhiteButtonProps> = ({ 
  size = 'md', 
  children, 
  onClick, 
  type = 'button',
  className = '',
  disabled = false,
}) => {
  const sizeClasses = {
    sm: 'h-8',  // 32px
    md: 'h-10', // 40px
    lg: 'h-[45px]', // 45px
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full flex items-center justify-center py-2 px-3 mt-6 text-black bg-gradient-to-b from-white via-white to-[#E0E0E0] rounded-full 
                  focus:outline-none ring-2 ring-white/10 focus:ring-opacity-50 shadow-inner-bottom
                  ${sizeClasses[size]} relative ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default WhiteButton; 