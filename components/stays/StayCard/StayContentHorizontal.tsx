import { ApartmentsItemInfo } from '../../../types/booking.types';
import { ApartmentInfo } from '../../../types/userToHotel.types';
import { formatPropertyRegion } from '../../../utils/location.utils';
import { formatPrice, getNightlyPriceWithCommission } from '../../../utils/rate.utils';

interface StayContentHorizontalProps {
  property: ApartmentsItemInfo | ApartmentInfo;
}

export function StayContentHorizontal({ property }: StayContentHorizontalProps) {
  const getLowestPrice = () => {
    // Check if this is an ApartmentsItemInfo by checking for rates property
    if (!('rates' in property) || !property.rates?.[0]) {
      return 0;
    }
    
    return getNightlyPriceWithCommission(property.rates[0]);
  };

  return (
    <View className="flex flex-col h-full p-3.5">
      {/* Rating */}
      <View className="flex items-center gap-1 mb-1 text-[10px]">
        <Text className="text-[#FFBF75]">★</Text>
        <Text className="text-white">{property.rating}</Text>
        <Text className="text-[#A9A9A9]">
          ({('reviewsNumber' in property ? property.reviewsNumber : 0)})
        </Text>
      </View>

      {/* Title */}
      <Text className="mb-1 text-xs font-medium text-white">
        {property.name}
      </Text>

      {/* Location */}
      <Text className="mb-auto text-[#A9A9A9] text-[10px]">
        {formatPropertyRegion([property.address, property.region?.name])}
      </Text>

      {/* Price */}
      <View className="mt-2">
        <Text className="text-xs font-bold text-white">${formatPrice(getLowestPrice())}</Text>
        <Text className="text-[#A9A9A9] text-[10px]"> / night</Text>
      </View>
    </View>
  );
} 