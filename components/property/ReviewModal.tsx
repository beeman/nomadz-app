import { useState } from 'react';
import { DEFAULT_AVATAR_PATH } from '../../constants/paths';
import { useApartments } from '../../hooks';
import { handleAvatarError } from '../../utils/image.utils';
import { ArrowsUpDownIcon, ThumbDownIcon, ThumbUpIcon, XMarkIcon } from '../icons/Icons';
import { Modal } from '../ui';
import Dropdown from '../ui/Dropdown';
import { RatingDistribution } from './RatingDistribution';

const REVIEW_SORT_OPTIONS = {
  'latest': 'Latest',
  'highest_rated': 'Highest rated',
  'lowest_rated': 'Lowest rated'
} as const;

type ReviewSortOption = keyof typeof REVIEW_SORT_OPTIONS; 

export default function ReviewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<ReviewSortOption>('latest');
  
  const { selectedApartment } = useApartments();

  if (!selectedApartment) return null;

  const rating = selectedApartment.rating;
  const totalReviews = selectedApartment.reviews?.length || 0;

  const sortReviews = (reviews: typeof selectedApartment.reviews) => {
    if (!reviews) return [];
    
    const sortedReviews = [...reviews];
    
    switch (sortBy) {
      case 'latest':
        return sortedReviews.sort((a, b) => 
          new Date(b.created).getTime() - new Date(a.created).getTime()
        );
      
      case 'highest_rated':
        return sortedReviews.sort((a, b) => b.rating - a.rating);
      
      case 'lowest_rated':
        return sortedReviews.sort((a, b) => a.rating - b.rating);
      
      default:
        return sortedReviews;
    }
  };

  // Calculate rating distribution
  const getRatingDistribution = () => {
    if (!selectedApartment.reviews) return [];
    
    const distribution = selectedApartment.reviews.reduce((acc, review) => {
      const rating = Math.round(review.rating / 2); // Convert to 1-5 scale if needed
      const existingRating = acc.find(r => r.rating === rating);
      
      if (existingRating) {
        existingRating.count++;
      } else {
        acc.push({ rating, count: 1 });
      }
      
      return acc;
    }, [] as { rating: number; count: number }[]);

    return distribution;
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[#8B5CF6] underline text-sm"
      >
        Read more
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <View className="max-w-[1000px] max-h-[90dvh] bg-black rounded-2xl overflow-hidden border border-[#313131]">
          {/* Modal Header */}
          <View className="relative flex items-center justify-between p-6">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute text-white left-6 hover:text-gray-300"
            >
              <XMarkIcon className="size-4 md:size-5 xl:size-6" />
            </button>
            <Text className="flex-1 text-xl font-medium text-center text-white md:text-2xl">
              {totalReviews} Reviews
            </Text>
          </View>

          {/* Fixed Sort Button */}
          <View className="absolute z-50 top-6 right-8">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="px-4 py-2 text-sm text-white rounded-full bg-[#313131] flex items-center justify-center space-x-1.5"
            >
              <ArrowsUpDownIcon className="w-4 h-4" />
              <Text className="truncate max-md:hidden">{REVIEW_SORT_OPTIONS[sortBy]}</Text>
            </button>
            <Dropdown 
              isOpen={isSortOpen} 
              onClose={() => setIsSortOpen(false)}
              className="w-40 py-2 bg-[#1B1B1B] rounded-xl border border-[#313131] !right-0 left-auto"
            >
              <View className="flex flex-col">
                {Object.entries(REVIEW_SORT_OPTIONS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSortBy(key as ReviewSortOption);
                      setIsSortOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-left truncate text-white hover:bg-[#313131]"
                  >
                    {label}
                  </button>
                ))}
              </View>
            </Dropdown>
          </View>

          {/* Modal Body */}
          <View className="grid xl:grid-cols-12 h-[calc(90vh-80px)] overflow-y-auto no-scrollbar">
            {/* Left Side - Rating Summary */}
            <View className="p-8 max-xl:grid max-xl:grid-cols-2 xl:col-span-4 max-xl:pb-0">
              <View className="flex flex-col items-center mb-8 drop-shadow-[0_0_50px_rgba(107,255,255)]">
                <Text className="text-4xl xl:text-[84px] leading-none font-medium text-white">
                  {rating}
                </Text>
                <View className="flex items-center gap-2 mt-4">
                  <View className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Text key={i} className="text-[#FFBF75] md:text-lg xl:text-2xl">
                        {i < Math.round(rating / 2) ? "★" : "☆"}
                      </Text>
                    ))}
                  </View>
                  <Text className="text-[#A9A9A9] text-sm">{totalReviews}</Text>
                </View>
              </View>

              <View className="xl:mb-8">
                <RatingDistribution 
                  ratings={getRatingDistribution()} 
                  totalReviews={totalReviews} 
                />
              </View>
            </View>

            {/* Right Side - Reviews List */}
            <View className="xl:overflow-y-auto xl:col-span-8">
              <View className="p-8 space-y-6">
                {sortReviews(selectedApartment.reviews)?.map((review) => (
                  <View 
                    key={review.id}
                    className="p-6 rounded-lg border border-[#272727]"
                  >
                    <View className="flex items-center justify-between mb-4">
                      <View className="flex items-center gap-3">
                        <img 
                          src={review.images?.[0] || DEFAULT_AVATAR_PATH}
                          alt={review.author}
                          className="rounded-full size-9"
                          onError={handleAvatarError}
                        />
                        <View className='flex text-white md:space-x-2 md:items-center max-md:flex-col'>
                          <Text className="text-sm font-medium">{review.author}</Text>
                          <Text className='max-md:hidden'>·</Text>
                          <Text className="text-xs">{review.created}</Text>
                        </View>
                      </View>
                      <View className="flex gap-1 max-xl:text-[10px]">
                        {[...Array(5)].map((_, i) => (
                          <Text key={i} className={i < Math.round(review.rating / 2) ? "text-[#FFBF75]" : "text-[#A7A7A7]"}>
                            ★
                          </Text>
                        ))}
                      </View>
                    </View>
                    {review.reviewPlus && (
                      <View className='text-[#CCCCCC]'>
                        <View className='flex items-center space-x-1 font-medium'>
                          <ThumbUpIcon className='text-[#4BD46B]' /><Text>advantages:</Text>
                        </View>
                        <View>{review.reviewPlus}</View>
                      </View>
                    )}
                    {review.reviewMinus && (
                      <View className='mt-2 text-[#CCCCCC]'>
                        <View className='flex items-center space-x-1 font-medium'>
                          <ThumbDownIcon className='text-[#F16B61]' /><Text>disadvantages:</Text>
                        </View>
                        <View>{review.reviewMinus}</View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
