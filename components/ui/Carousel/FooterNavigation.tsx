import { DoubleChevronLeftIcon, DoubleChevronRightIcon } from '@/components/icons/Icons'
import DotGroup from '@/components/ui/Carousel/DotGroup'
import { View } from 'react-native'

const FooterNavigation = ({
  handlePrevious,
  handleNext,
  showNavigation,
  dotGroupClass,
  items,
  currentIndex,
  hideArrows = false,
  setInternalIndex,
  visibleDotsCount,
}: {
  handlePrevious: () => void
  handleNext: () => void
  showNavigation: boolean
  dotGroupClass: string
  items: any[]
  currentIndex: number
  hideArrows?: boolean
  setInternalIndex: (index: number) => void
  visibleDotsCount: number
}) => (
  <View className={`inline-flex self-center flex-row items-center justify-center max-w-full gap-8 ${dotGroupClass}`}>
    {/* Mobile Left Arrow */}
    {showNavigation && !hideArrows && (
      <View onTouchStart={handlePrevious} aria-label="Previous slide">
        <DoubleChevronLeftIcon width={24} height={24} />
      </View>
    )}

    {/* Dot Navigation */}
    <DotGroup
      items={items}
      currentIndex={currentIndex}
      setInternalIndex={setInternalIndex}
      visibleDotsCount={visibleDotsCount}
      className="grow"
    />

    {/* Mobile Right Arrow */}
    {showNavigation && !hideArrows && (
      <View onTouchStart={handleNext} aria-label="Next slide">
        <DoubleChevronRightIcon width={24} height={24} />
      </View>
    )}
  </View>
)
export default FooterNavigation
