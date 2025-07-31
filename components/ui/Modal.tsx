import { useEffect, FC } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

const Modal: FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  overlayClassName = ''
}: ModalProps) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center h-screen bg-black/50 backdrop-blur-sm ${overlayClassName}`}
      onClick={onClose}
    >
      <div 
        className={`relative ${className}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;