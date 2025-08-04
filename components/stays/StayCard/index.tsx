import { Link } from 'react-router-dom';
import { RoutePaths } from '../../../enums';
import { useApartmentEvents, useSearchParams } from '../../../hooks';
import { useAuth } from '../../../hooks/auth.hooks';
import { ApartmentsItemInfo } from '../../../types/booking.types';
import { ApartmentInfo } from '../../../types/userToHotel.types';
import { resolveUrl } from '../../../utils/app.utils';
import SaveApartmentButton from '../../ui/SaveApartmentButton';
import { StayCarousel } from './StayCarousel';
import { StayContent } from './StayContent';
import { StayContentHorizontal } from './StayContentHorizontal';

interface StayCardProps {
  stay: ApartmentsItemInfo | ApartmentInfo;
  variant?: 'vertical' | 'horizontal';
  className?: string;
  showLink?: boolean;
  searchParams?: any;
}

export default function StayCard({
  stay,
  variant = 'vertical',
  className = '',
  showLink = true,
  searchParams = {},
}: StayCardProps) {
  const isVertical = variant === 'vertical';
  const { getCombinedParams } = useSearchParams();
  const { authenticatedUser } = useAuth();
  const { events, toggleSaveApartment, isLoading: areEventsLoading } = useApartmentEvents();

  const propertyUrl = resolveUrl(RoutePaths.PROPERTY.replace(':id', stay.hid?.toString()), {
    checkin: getCombinedParams().checkin,
    checkout: getCombinedParams().checkout,
    guests: getCombinedParams().guests,
    ...searchParams,
  });

  return (
    <View
      className={`
        group relative bg-[#151515] rounded-xl overflow-hidden border border-[#212121]
        ${isVertical ? 'aspect-[1/1]' : 'flex'}
        ${className}
      `}
    >
      {showLink ? (
        <Link
          to={propertyUrl}
          className={isVertical ? '' : 'flex flex-1'}
          target='_blank'
          rel='noopener noreferrer'
        >
          <View className={`relative ${isVertical ? 'h-2/3' : 'w-[42%]'}`}>
            <StayCarousel stay={stay} isSquare={isVertical ? false : true} />
          </View>

          <View className={isVertical ? 'h-1/3' : 'flex-1'}>
            {isVertical ? <StayContent stay={stay} /> : <StayContentHorizontal property={stay} />}
          </View>
        </Link>
      ) : (
        <>
          <View className={`relative ${isVertical ? 'h-2/3' : 'w-[42%]'}`}>
            <StayCarousel stay={stay} isSquare={isVertical ? false : true} />
          </View>

          <View className={isVertical ? 'h-1/3' : 'flex-1'}>
            {isVertical ? <StayContent stay={stay} /> : <StayContentHorizontal property={stay} />}
          </View>
        </>
      )}

      <SaveApartmentButton
        hid={stay.hid}
        isAuthenticated={!!authenticatedUser}
        events={events}
        onToggleSave={toggleSaveApartment}
        isLoading={areEventsLoading}
        className='top-3 right-3 size-7 min-[500px]:size-6'
      />
    </View>
  );
}
