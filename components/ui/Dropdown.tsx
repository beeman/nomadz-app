import React from 'react';

interface DropdownProps {
  isOpen: boolean;
  className?: string;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: number | undefined | null;
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, className, onClose, children, zIndex = 50 }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0"
        style={{ zIndex: zIndex - 10 }}
        onClick={onClose}
      />
      <div className={`absolute left-0 mt-2 top-full ${className}`} style={{ zIndex }}>
        {children}
      </div>
    </>
  );
};

export default Dropdown;