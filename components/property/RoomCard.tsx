import { CalendarX } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CURRENCIES } from '../../constants';
import { AMENITY_METADATA, DEFAULT_AMENITY_METADATA } from '../../data/amenityMetadata';
import { DoubleBedIcon, SingleBedIcon } from '../icons/Icons';
import ImageGrid from '../ImageGrid/ImageGrid';
import { Modal } from '../ui';
import WhiteButton from '../ui/Buttons/WhiteButton';
import CancellationRulesModal from './CancellationRulesModal';
import FacilitiesCard from './FacilitiesCard';

interface RoomCardProps {
  room: {
    name: string;
    price: number;
    images: string[];
    amenities: string[];
    nameStruct?: {
      beddingType?: string;
    };
    guests?: number;
  };
  rate: {
    book_hash: string;
    daily_prices: string[];
    meal_data: {
      value: string;
      has_breakfast: boolean;
      no_child_meal: boolean;
    };
    payment_options?: {
      payment_types: {
        show_currency_code: string;
        show_amount?: string;
        show_amount_with_commission?: string;
        tax_data?: {
          taxes: {
            currency_code: string;
            amount: string;
          }[];
        };
        cancellation_penalties?: any;
      }[];
    };
  } | null;
  onBookNow: (room: any, rate: any, hash: string) => void;
  isAvailable: boolean;
}

export default function RoomCard({ room, rate, onBookNow, isAvailable }: RoomCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFacilitiesOpen, setIsFacilitiesOpen] = useState(false);
  const [isCancellationOpen, setIsCancellationOpen] = useState(false);

  // Calculate total amount including taxes
  const paymentDetails = rate?.payment_options?.payment_types?.[0];

  let totalAmount: number;

  // If we have commission amount that includes taxes, use it directly
  if (paymentDetails?.show_amount_with_commission) {
    totalAmount = Number(paymentDetails.show_amount_with_commission);
  } else {
    // Fallback to original calculation
    const basePrice = paymentDetails?.show_amount ? Number(paymentDetails.show_amount) : 0;
    const taxes = paymentDetails?.tax_data?.taxes || [];
    const totalTaxes = taxes.reduce((sum, tax) => {
      if (tax.currency_code === paymentDetails?.show_currency_code) {
        return sum + Number(tax.amount);
      }
      return sum;
    }, 0);
    totalAmount = basePrice + totalTaxes;
  }

  const nights = rate?.daily_prices?.length || 1;
  const currencyChar = CURRENCIES.find(c => c.code === paymentDetails?.show_currency_code)?.char;
  const mealData = rate?.meal_data || {
    value: 'nomeal',
    has_breakfast: false,
    no_child_meal: true,
  };

  // Get cancellation data from rate
  const cancellationPenalties = paymentDetails?.cancellation_penalties || null;
  const freeCancellationBefore = cancellationPenalties?.free_cancellation_before || null;

  return (
    <View className='border-gradient-gray rounded-[24px] h-full flex flex-col font-geist'>
      <View className='!p-1 rounded-[23px] bg-gradient-1213 h-full flex flex-col'>
        <View className='@container relative rounded-[19px] bg-black !py-7 !px-6 @sm:!p-4 flex flex-col h-full'>
          {/* Main content: image + price side by side */}
          <View className='grid grid-cols-2 gap-6 min-h-[90.45px]'>
            {/* Image */}
            {room.images[0] && (
              <View
                className='w-full cursor-pointer shrink-0'
                onClick={() => setIsGalleryOpen(true)}
              >
                <img
                  src={room.images[0].replace('{size}', '640x640')}
                  alt='Room main view'
                  className='object-cover w-full h-full rounded-xl !aspect-[3/2]'
                />
              </View>
            )}
            {/* Price and nights */}
            <View className='flex flex-col justify-center'>
              <View className='text-[11px] text-[#CCCCCC]'>
                {nights} night{nights > 1 ? 's' : ''}
              </View>
              <View className='text-3xl font-semibold text-white'>
                {currencyChar}
                {totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </View>
              <View className='mt-1 text-xs text-[#CCCCCC]'>including taxes and fees</View>
            </View>
          </View>

          <View className='h-px mt-5 bg-[#323232]' />

          {/* Room name, bed */}
          <View className='px-0 pt-0 mb-2 text-white'>
            <View className='my-6 mb-1 text-2xl font-semibold'>{room.name}</View>
            {room?.nameStruct?.beddingType && (
              <View className='flex items-center gap-2 my-6 text-base'>
                {room?.nameStruct?.beddingType?.includes('single') && (
                  <Text className='flex items-center gap-1.5 text-sm'>
                    <Text>{room.nameStruct.beddingType}</Text> <SingleBedIcon className='h-3.5' />
                  </Text>
                )}
                {room?.nameStruct?.beddingType?.includes('twin') && (
                  <Text className='flex items-center gap-1.5 text-sm'>
                    <Text>{room.nameStruct.beddingType}</Text> <SingleBedIcon className='h-3.5' />{' '}
                    <SingleBedIcon className='h-3.5' />
                  </Text>
                )}
                {room?.nameStruct?.beddingType?.includes('double') && (
                  <Text className='flex items-center gap-1.5 text-sm'>
                    <Text>{room.nameStruct.beddingType}</Text> <DoubleBedIcon className='h-3.5' />
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Breakfast Included */}
          {mealData.has_breakfast && (
            <View className='bg-[#121212] px-6 py-3 rounded-[14px] mx-0 mb-4 flex flex-col gap-1 border border-[#242424]'>
              <Text className='flex items-center gap-2 text-sm font-medium text-white'>
                🍳 Breakfast Included
              </Text>
              <Text className='text-xs text-[#D0D0D0]'>
                Breakfast options available during your stay.
              </Text>
            </View>
          )}

          {rate?.payment_options?.payment_types?.some(
            type => type.cancellation_penalties.free_cancellation_before,
          ) && (
            <View className='bg-[#121212] px-6 py-3 rounded-[14px] mx-0 mb-4 flex flex-col gap-1 border border-[#242424]'>
              <Text className='flex items-center gap-2 text-sm font-medium text-white'>
                <CalendarX className='size-4' /> Free Cancellation Available
              </Text>
              <Text className='text-xs text-[#D0D0D0]'>
                You will be able cancel your order before{' '}
                {new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(
                  new Date(
                    rate?.payment_options?.payment_types?.find(
                      type => type.cancellation_penalties.free_cancellation_before,
                    )!.cancellation_penalties.free_cancellation_before,
                  ),
                )}{' '}
                for no cost
              </Text>
            </View>
          )}

          {/* Amenities */}
          <FacilitiesCard amenities={room.amenities} onShowAll={() => setIsFacilitiesOpen(true)} />

          {/* Spacer to push bottom section down */}
          <View className='flex-1 min-h-6' />

          {/* Cancellation Rules and Book Now - always at the bottom */}
          <View className='grid grid-cols-2 px-0 mt-2'>
            <button
              type='button'
              onClick={() => setIsCancellationOpen(true)}
              className='text-sm underline text-[#D0D0D0] content-center text-left'
            >
              Cancellation Rules
            </button>
            <WhiteButton
              className={`!mt-0 disabled:opacity-75`}
              onClick={() => onBookNow(room, rate, rate?.book_hash || '')}
              disabled={!isAvailable}
            >
              book now
            </WhiteButton>
          </View>

          {/* Gallery Modal */}
          {isGalleryOpen &&
            createPortal(
              <Modal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                className='z-50'
              >
                <View className='w-[90vw] h-[90dvh] bg-[#151515] rounded-xl p-6 overflow-y-auto'>
                  <View className='flex items-center justify-between mb-6'>
                    <Text className='text-xl font-medium text-white'>Gallery</Text>
                    <button
                      onClick={() => setIsGalleryOpen(false)}
                      className='text-white/60 hover:text-white'
                    >
                      close
                    </button>
                  </View>
                  <ImageGrid images={room.images} name={room.name} />
                </View>
              </Modal>,
              document.body,
            )}

          {/* Facilities Modal */}
          {isFacilitiesOpen &&
            createPortal(
              <Modal isOpen={isFacilitiesOpen} onClose={() => setIsFacilitiesOpen(false)}>
                <View className='max-w-[800px] max-h-[90dvh] bg-[#121212] rounded-2xl overflow-y-auto no-scrollbar border border-[#313131]'>
                  <View className='p-8'>
                    <View className='grid gap-4 md:grid-cols-2'>
                      {room.amenities.map((amenity, index) => {
                        const metadata = AMENITY_METADATA[amenity] || DEFAULT_AMENITY_METADATA;
                        const IconComponent = metadata.icon;
                        return (
                          <View
                            key={index}
                            className='p-6 rounded-lg bg-[#1A1A1A] border border-[#292929] text-white'
                          >
                            <View className='flex items-center gap-3 mb-2'>
                              <Text
                                style={{
                                  display: 'inline-flex',
                                  width: 24,
                                  height: 24,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <IconComponent />
                              </Text>
                              <Text className='font-medium text-left sm:text-lg'>{amenity}</Text>
                            </View>
                            <Text className='text-xs sm:text-sm'>{metadata.description}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
              </Modal>,
              document.body,
            )}

          {/* Cancellation Rules Modal */}
          <CancellationRulesModal
            isOpen={isCancellationOpen}
            onClose={() => setIsCancellationOpen(false)}
            freeCancellationBefore={freeCancellationBefore}
            cancellationPenalties={cancellationPenalties}
            currencyChar={currencyChar}
          />
        </View>
      </View>
    </View>
  );
}
