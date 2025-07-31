import { useAuth } from '@/components/auth/auth-provider';
import SaveApartmentButton from '@/components/ui/SaveApartmentButton';
import { Link } from 'expo-router';
import { View } from 'react-native';
import { ApartmentInfo } from '../../types/booking.types';
import { ArrowLeftIcon } from '../icons/Icons';

interface DesktopHeaderProps {
  property: ApartmentInfo;
}

export default function DesktopHeader({ property }: DesktopHeaderProps) {
  const { user } = useAuth();
  const { rating, reviews } = property;
  const totalReviews = reviews?.length || 0;

  return (
    <View className="flex items-center justify-between w-full mb-4 text-white max-md:hidden">
      <View className="flex items-center gap-6">
        <Link href="/" className="size-10 p-2.5 transition-colors rounded-full bg-[#181414]">
          <ArrowLeftIcon className='size-full text-[#D9D9D9]' />
        </Link>
        
        <Text className='text-xl font-medium text-left sm:text-xl md:text-2xl'>{property.name}</Text> 
      </View>

      <View className="flex items-center gap-2">
        <SaveApartmentButton
          hid={property.hid}
          isAuthenticated={!!user}
          events={[]}
          onToggleSave={toggleSaveApartment}
          isLoading={areEventsLoading}
          className="!static p-2.5 transition-colors rounded-full !bg-[#181414] size-10"
        />
        <ShareButton className='p-2.5 transition-colors rounded-full bg-[#181414] size-10' url={window.location.href} />
      </View>
    </View>
  );
}
