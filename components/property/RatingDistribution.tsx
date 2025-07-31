interface RatingDistributionProps {
  ratings: {
    rating: number;
    count: number;
  }[];
  totalReviews: number;
}

export function RatingDistribution({ ratings, totalReviews }: RatingDistributionProps) {
  return (
    <View className="space-y-1 xl:space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const ratingData = ratings.find(r => r.rating === rating) || { count: 0 };
        const percentage = totalReviews > 0 ? (ratingData.count / totalReviews) * 100 : 0;
        
        return (
          <View key={rating} className="flex items-center gap-2">
            <Text className="w-3 text-xs text-white xl:text-sm">{rating}</Text>
            <View className="flex-1 h-1.5 xl:h-2 overflow-hidden bg-[#272727] rounded-full">
              <View 
                className="h-full bg-[#FFBF75] rounded-full" 
                style={{ width: `${percentage}%` }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
} 