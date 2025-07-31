import { FC, ReactNode } from 'react';

interface ButtonProps {
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  prefixIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ 
  size = 'md', 
  children, 
  onClick, 
  type = 'button',
  prefixIcon,
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
      className={`w-full py-2 px-3 !mt-6 text-black bg-white rounded-full hover:bg-gray-200 
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 
                  ${sizeClasses[size]} relative ${className}`}
      disabled={disabled}
    >
      {prefixIcon && (
        <div className="absolute -translate-y-1/2 left-3 top-1/2">
          {prefixIcon}
        </div>
      )}
      <span className="w-full text-center">{children}</span>
    </button>
  );
};

export default Button; 