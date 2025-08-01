import { ArrowsUpDownIcon, ThumbDownIcon, ThumbUpIcon, XMarkIcon } from '@/components/icons/Icons'
import { RatingDistribution } from '@/components/property/RatingDistribution'
import Dropdown from '@/components/ui/Dropdown'
import Modal from '@/components/ui/Modal'
import { ApartmentInfo } from '@/types/booking.types'
import { useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

const REVIEW_SORT_OPTIONS = {
  latest: 'Latest',
  highest_rated: 'Highest rated',
  lowest_rated: 'Lowest rated',
} as const

type ReviewSortOption = keyof typeof REVIEW_SORT_OPTIONS

export default function ReviewModal({ property }: { property: ApartmentInfo }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [sortBy, setSortBy] = useState<ReviewSortOption>('latest')

  if (!property) return null

  const rating = property.rating
  const totalReviews = property.reviews?.length || 0

  const sortReviews = (reviews: typeof property.reviews) => {
    if (!reviews) return []

    const sortedReviews = [...reviews]

    switch (sortBy) {
      case 'latest':
        return sortedReviews.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())

      case 'highest_rated':
        return sortedReviews.sort((a, b) => (b.rating || 0) - (a.rating || 0))

      case 'lowest_rated':
        return sortedReviews.sort((a, b) => (a.rating || 0) - (b.rating || 0))

      default:
        return sortedReviews
    }
  }

  // Calculate rating distribution
  const getRatingDistribution = () => {
    if (!property.reviews) return []

    const distribution = property.reviews.reduce(
      (acc, review) => {
        const rating = Math.round((review.rating || 0) / 2) // Convert to 1-5 scale if needed
        const existingRating = acc.find((r) => r.rating === rating)

        if (existingRating) {
          existingRating.count++
        } else {
          acc.push({ rating, count: 1 })
        }

        return acc
      },
      [] as { rating: number; count: number }[],
    )

    return distribution
  }

  return (
    <>
      <View onTouchStart={() => setIsOpen(true)} className="inline-flex flex-row self-start">
        <Text className="text-[#8B5CF6] border-b border-[#8B5CF6] text-sm font-primary pb-[0.5px]">Read more</Text>
      </View>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <View className="flex flex-col max-w-full w-full max-h-[90dvh] bg-black rounded-2xl overflow-hidden border border-[#313131]">
          {/* Modal Header */}
          <View className="relative flex flex-row items-center justify-between p-6 w-full">
            <Text className="inline-flex flex-1 text-xl font-primary-medium text-center text-white">
              {totalReviews} Reviews
            </Text>
            <View onTouchStart={() => setIsOpen(false)} className="absolute text-white left-6 hover:text-gray-300">
              <XMarkIcon className="size-4" color="white" />
            </View>
            {/* Fixed Sort Button */}
            <View className="absolute z-50 right-8">
              <View
                onTouchStart={() => setIsSortOpen(!isSortOpen)}
                className="px-4 py-2 text-sm text-white rounded-full bg-[#313131] flex flex-row items-center justify-center gap-x-1.5"
              >
                <ArrowsUpDownIcon width={16} height={16} color="white" />
              </View>
              <Dropdown
                isOpen={isSortOpen}
                onClose={() => setIsSortOpen(false)}
                className="w-40 py-2 bg-[#1B1B1B] rounded-xl border border-[#313131] right-0 top-full mt-2"
              >
                <View className="flex flex-col">
                  {Object.entries(REVIEW_SORT_OPTIONS).map(([key, label], index) => (
                    <View
                      key={index}
                      onTouchStart={() => {
                        setSortBy(key as ReviewSortOption)
                        setIsSortOpen(false)
                      }}
                      className="px-4 py-2 text-sm text-left truncate text-white hover:bg-[#313131]"
                    >
                      <Text className="text-white">{label}</Text>
                    </View>
                  ))}
                </View>
              </Dropdown>
            </View>
          </View>

          {/* Modal Body */}
          <ScrollView className="flex flex-col max-h-[500px]">
            {/* Left Side - Rating Summary */}
            <View className="p-8 flex flex-row">
              <View className="flex flex-col flex-1 items-center mb-8 drop-shadow-[0_0_50px_rgba(107,255,255)]">
                <Text className="text-4xl leading-none font-medium text-white">{rating}</Text>
                <View className="flex flex-row items-center gap-2 mt-4">
                  <View className="flex flex-row gap-1 items-center">
                    {[...Array(5)].map((_, i) => (
                      <Text key={i} className="text-[#FFBF75] pb-1">
                        {i < Math.round((rating || 0) / 2) ? '★' : '☆'}
                      </Text>
                    ))}
                  </View>
                  <Text className="text-[#A9A9A9] text-sm">{totalReviews}</Text>
                </View>
              </View>

              <View className="flex flex-row flex-1 border">
                <RatingDistribution ratings={getRatingDistribution()} totalReviews={totalReviews} />
              </View>
            </View>

            {/* Right Side - Reviews List */}

            <View className="flex flex-col p-8 gap-y-6">
              {sortReviews(property.reviews)?.map((review, index) => (
                <View key={index} className="p-6 rounded-lg border border-[#272727]">
                  <View className="flex flex-row items-center justify-between mb-4">
                    <View className="flex flex-row items-center gap-3">
                      <Image
                        source={require('@/assets/pngs/default-avatar.png')}
                        alt={review.author}
                        className="rounded-full size-9"
                      />
                      <View className="flex flex-col">
                        <Text className="text-sm font-primary-medium text-white">{review.author}</Text>
                        <Text className="text-xs text-white font-primary">{review.created}</Text>
                      </View>
                    </View>
                    <View className="flex flex-row gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Text
                          key={i}
                          className={i < Math.round((review.rating || 0) / 2) ? 'text-[#FFBF75]' : 'text-[#A7A7A7]'}
                        >
                          ★
                        </Text>
                      ))}
                    </View>
                  </View>
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
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  )
}
