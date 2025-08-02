import { View } from 'react-native'

const DotGroup = ({
  items,
  currentIndex,
  setInternalIndex,
  visibleDotsCount,
  className = '',
}: {
  items: any[]
  currentIndex: number
  setInternalIndex: (index: number) => void
  visibleDotsCount: number
  className?: string
}) => {
  // Handle cases when the length of items array is less than visibleDotsCount
  const dotsNumber = Math.min(visibleDotsCount, items.length)

  // Determine the starting index for the dots group to be centered
  const startIndex = Math.max(0, Math.min(currentIndex - Math.floor(dotsNumber / 2), items.length - dotsNumber))

  return (
    <View className={`flex flex-row justify-center gap-1 ${className}`}>
      {Array.from({ length: dotsNumber }, (_, index) => {
        const dotIndex = startIndex + index

        // Calculate the scale based on the distance to the currentIndex
        const distance = Math.abs(dotIndex - currentIndex)
        let scale = 1 // Default scale for the active dot

        // Scale down only for non-active dots
        if (distance === 1) {
          scale = 0.8 // Slightly smaller for adjacent dots
        } else if (distance === 2) {
          scale = 0.6 // Even smaller for two steps away dots
        } else if (distance > 2) {
          scale = 0.6 // Apply same scaling for all further dots
        }

        return (
          <View
            key={index}
            onTouchStart={() => setInternalIndex(dotIndex)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              dotIndex === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
            style={{
              transform: [dotIndex === currentIndex ? { scale: 1 } : { scale }],
            }}
            aria-label={`Go to slide ${dotIndex + 1}`}
          />
        )
      })}
    </View>
  )
}

export default DotGroup
