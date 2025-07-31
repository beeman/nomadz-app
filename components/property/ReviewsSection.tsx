import { DEFAULT_AVATAR_PATH } from '../../constants/paths'
import { handleAvatarError } from '../../utils/image.utils'
import { ThumbDownIcon, ThumbUpIcon } from '../icons/Icons'
import ReviewModal from './ReviewModal'

interface ReviewsSectionProps {
  property: any // Update type when available
}

export default function ReviewsSection({ property }: ReviewsSectionProps) {
  const { rating, reviews } = property
  const totalReviews = reviews?.length || 0

  return (
    <View className="mb-6 text-white xl:mb-12">
      <Text className="mb-6 text-2xl text-left">reviews</Text>
      {totalReviews === 0 ? (
        <View className="text-[#A9A9A9] text-left xl:pt-4 xl:pb-12">no reviews yet</View>
      ) : (
        <>
          {/* Rating Overview */}
          <View className="flex items-end gap-3 mb-8">
            <Text className="text-[#FFBF75] text-4xl">★</Text>
            <Text className="text-4xl">{rating}</Text>
            <Text className="text-xl text-[#A9A9A9] mb-0.5">({totalReviews})</Text>
          </View>
          <View className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {reviews.slice(0, 3).map((review) => (
              <View key={review.id} className="p-8 bg-[#151515] rounded-xl h-fit">
                {/* Review Header */}
                <View className="flex items-center gap-3 mb-4">
                  <img
                    src={review.images?.[0] || DEFAULT_AVATAR_PATH}
                    alt={review.author}
                    className="object-cover w-12 h-12 rounded-full"
                    onError={handleAvatarError}
                  />
                  <View>
                    <Text>{review.author}</Text>
                    <View className="flex gap-1">
                      <View className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Text
                            key={i}
                            className={i < Math.round(review.rating / 2) ? 'text-[#FFBF75]' : 'text-[#A7A7A7]'}
                          >
                            ★
                          </Text>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Review Text */}
                <View className="text-sm text-[#7D7F88]">
                  {review.reviewPlus && (
                    <View className="text-[#CCCCCC]">
                      <View className="flex items-center space-x-1 font-medium">
                        <ThumbUpIcon className="text-[#4BD46B]" />
                        <Text>advantages:</Text>
                      </View>
                      <View className="overflow-hidden line-clamp-2 text-ellipsis">{review.reviewPlus}</View>
                    </View>
                  )}
                  {review.reviewMinus && (
                    <View className="mt-2 text-[#CCCCCC]">
                      <View className="flex items-center space-x-1 font-medium">
                        <ThumbDownIcon className="text-[#F16B61]" />
                        <Text>disadvantages:</Text>
                      </View>
                      <View className="overflow-hidden line-clamp-2 text-ellipsis">{review.reviewMinus}</View>
                    </View>
                  )}
                  <ReviewModal />
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  )
}
