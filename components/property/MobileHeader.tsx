import { Link } from 'react-router-dom';
import { useApartmentEvents, useAuth } from '../../hooks';
import { ApartmentInfo } from '../../types/booking.types';
import { ArrowLeftIcon } from '../icons/Icons';
import ShareButton from '../ShareButton';
import SaveApartmentButton from '../ui/SaveApartmentButton';

interface MobileHeaderProps {
  property: ApartmentInfo;
}

export default function MobileHeader({ property }: MobileHeaderProps) {
  const { authenticatedUser } = useAuth();
  const { events, toggleSaveApartment, isLoading: areEventsLoading } = useApartmentEvents();

  return (
    <View className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between w-full p-2 md:hidden text-[#D9D9D9]">
      <Link 
        to="/" 
        className="p-2 transition-colors rounded-full bg-[#323232]/50"
      >
        <ArrowLeftIcon className='size-5' />
      </Link>

      <View className="flex items-center gap-2">
        <SaveApartmentButton
          hid={property.hid}
          isAuthenticated={!!authenticatedUser}
          events={events}
          onToggleSave={toggleSaveApartment}
          isLoading={areEventsLoading}
          className="!static p-2 transition-colors rounded-full !bg-[#323232]/50 size-9"
        />
        <ShareButton 
          className='p-2 transition-colors rounded-full bg-[#323232]/50 size-9' 
          url={window.location.href} 
        />
      </View>
    </View>
  );
}
