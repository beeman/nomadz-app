import { HeartFilledIcon, HeartIcon } from '../icons/Icons';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import toastNotifications from '../../utils/toastNotifications.utils';

interface SaveApartmentButtonProps {
  hid: number;
  isAuthenticated: boolean;
  events: any[];
  onToggleSave: (hid: number) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export default function SaveApartmentButton({
  hid,
  isAuthenticated,
  events,
  onToggleSave,
  isLoading = false,
  className = '',
}: SaveApartmentButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const event = events.find(event => event.hid === hid);
    setIsSaved(event?.isSaved || false);
  }, [events, hid]);

  const handleSaveToggle = debounce(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsSaved(!isSaved);
      await onToggleSave(hid);
    } catch (error) {
      setIsSaved(isSaved);
      toastNotifications.error('Failed to update property');
    }
  }, 300);

  useEffect(() => {
    return () => {
      handleSaveToggle.cancel();
    };
  }, []);

  if (!isAuthenticated) return null;

  return (
    <button 
      onClick={handleSaveToggle}
      disabled={isLoading}
      className={`absolute p-1 transition-colors rounded-full z-10 cursor-pointer ${
        isSaved 
          ? 'bg-white hover:bg-white/90' 
          : 'bg-black/70 hover:bg-black/50'
      } ${className}`}
    >
      {isSaved ? <HeartFilledIcon className='size-full' /> : <HeartIcon className='text-white size-full' />}
    </button>
  );
}