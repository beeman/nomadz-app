import { Text, View } from 'react-native'

interface RatingDistributionProps {
  ratings: {
    rating: number
    count: number
  }[]
  totalReviews: number
}

export function RatingDistribution({ ratings, totalReviews }: RatingDistributionProps) {
  return (
    <View className="gap-y-1 flex flex-col flex-1">
      {[5, 4, 3, 2, 1].map((rating, index) => {
        const ratingData = ratings.find((r) => r.rating === rating) || { count: 0 }
        const percentage = totalReviews > 0 ? (ratingData.count / totalReviews) * 100 : 0

        return (
          <View key={index} className="flex flex-row w-full items-center gap-2">
            <Text className="w-3 text-xs text-white">{rating}</Text>
            <View className="flex flex-col flex-1 h-1.5 overflow-hidden bg-[#272727] rounded-full">
              <View className="flex flex-col h-full bg-[#FFBF75] rounded-full" style={{ width: `${percentage}%` }} />
            </View>
          </View>
        )
      })}
    </View>
  )
}
