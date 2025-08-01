import { DotGroup } from 'pure-react-carousel'
interface CarouselDotGroupProps {
  className?: string
}

export function CarouselDotGroup({ className }: CarouselDotGroupProps) {
  return (
    <View className={`absolute z-20 -translate-x-1/2 bottom-3 left-1/2 ${className || ''}`}>
      <DotGroup
        className="flex gap-1"
        renderDots={({ totalSlides, currentSlide, carouselStore }) => {
          const maxVisibleDots = 5
          const dots = []
          const total = totalSlides ?? 0
          const current = currentSlide ?? 0

          // Get or initialize the dot range from store
          const state = carouselStore.getStoreState()
          let startDot = state.startDot ?? 0
          let endDot = state.endDot ?? Math.min(total, maxVisibleDots)

          if (total > maxVisibleDots) {
            // Only adjust range when current slide goes outside visible range
            if (current >= endDot || current < startDot) {
              startDot = Math.max(0, current - Math.floor(maxVisibleDots / 2))
              endDot = Math.min(startDot + maxVisibleDots, total)
              startDot = Math.max(0, endDot - maxVisibleDots) // Readjust start if end hit total

              // Store the new range
              carouselStore.setStoreState({
                startDot,
                endDot,
              })
            }
          }

          // Create dots within the calculated range
          for (let i = startDot; i < endDot; i++) {
            dots.push(
              <Button
                key={i}
                title={`Photo ${i + 1} of ${total}`}
                onClick={() => carouselStore.setStoreState({ currentSlide: i })}
                className={`w-1.5 h-1.5 shrink-0 rounded-full transition-colors duration-200
                  ${current === i ? 'bg-white' : 'bg-white/50'}`}
              />,
            )
          }
          return dots
        }}
      />
    </View>
  )
}
