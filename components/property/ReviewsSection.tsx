import { ThumbDownIcon, ThumbUpIcon } from '@/components/icons/Icons'
import { Image, Text, View } from 'react-native'

interface ReviewsSectionProps {
  property: any // Update type when available
}

export default function ReviewsSection({ property }: ReviewsSectionProps) {
  const { rating, reviews } = property
  const totalReviews = reviews?.length || 0

  return (
    <View className="mb-6 text-white">
      <Text className="mb-6 text-2xl text-left font-primary-medium text-white">reviews</Text>
      {totalReviews === 0 ? (
        <Text className="text-[#A9A9A9] text-left font-primary">no reviews yet</Text>
      ) : (
        <>
          {/* Rating Overview */}
          <View className="flex flex-row items-end gap-3 mb-8">
            <Text className="text-[#FFBF75] font-primary text-[40px]">★</Text>
            <Text className="text-4xl text-white font-primary">{rating}</Text>
            <Text className="text-xl text-[#A9A9A9] font-primary mb-0.5">({totalReviews})</Text>
          </View>
          <View className="flex flex-col gap-5">
            {reviews.slice(0, 3).map((review: any) => (
              <View key={review.id} className="p-8 bg-[#151515] rounded-xl h-fit">
                {/* Review Header */}
                <View className="flex flex-row items-center gap-3 mb-4">
                  <Image
                    source={require('@/assets/pngs/default-avatar.png')}
                    alt={review.author}
                    className="object-cover w-12 h-12 rounded-full"
                  />
                  <View className="flex flex-col">
                    <Text className="text text-white font-primary">{review.author}</Text>
                    <View className="flex flex-row gap-1">
                      <View className="flex flex-row gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Text
                            key={i}
                            className={`text font-primary ${i < Math.round(review.rating / 2) ? 'text-[#FFBF75]' : 'text-[#A7A7A7]'}`}
                          >
                            ★
                          </Text>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Review Text */}
                <View className="flex flex-col gap-2">
                  {!!review.reviewPlus && (
                    <View className="flex flex-col gap-2">
                      <View className="flex flex-row items-center gap-x-1 font-medium">
                        <ThumbUpIcon color="#4BD46B" />
                        <Text className="text-[#CCCCCC] font-primary-medium">advantages:</Text>
                      </View>
                      <Text className="overflow-hidden line-clamp-2 text-ellipsis text-[#CCCCCC] font-primary-medium leading-6">
                        {review.reviewPlus}
                      </Text>
                    </View>
                  )}
                  {!!review.reviewMinus && (
                    <View className="flex flex-col gap-2">
                      <View className="flex flex-row items-center gap-x-1 font-medium">
                        <ThumbDownIcon color="#F16B61" />
                        <Text className="text-[#CCCCCC] font-primary-medium">disadvantages:</Text>
                      </View>
                      <Text className="overflow-hidden line-clamp-2 text-ellipsis text-[#CCCCCC] font-primary leading-6">
                        {review.reviewMinus}
                      </Text>
                    </View>
                  )}
                  {/* <ReviewModal /> */}
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  )
}
