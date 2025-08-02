import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

// Assuming you have these components
import { DoubleChevronLeftIcon, DoubleChevronRightIcon } from '@/components/icons/Icons'
import FooterNavigation from './FooterNavigation'

interface CarouselProps {
  items: any[]
  currentIndex?: number
  onIndexChange?: (index: number) => void
  showNavigation?: boolean
  dotGroupClass?: string
  className?: string
  carouselContainerClassName?: string
  style?: any
  visibleDotsCount?: number
  hideArrows?: boolean
  hideDotsArrows?: boolean
  onTapItem?: (index: number) => void
}

const { width: screenWidth } = Dimensions.get('window')

export default function Carousel({
  items,
  currentIndex: externalIndex,
  onIndexChange,
  showNavigation = true,
  dotGroupClass = 'mt-6',
  className = '',
  carouselContainerClassName,
  style,
  visibleDotsCount = 5,
  hideArrows = false,
  hideDotsArrows = false,
  onTapItem,
}: CarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0)
  const currentIndex = typeof externalIndex === 'number' ? externalIndex : internalIndex

  // Shared values for handling the state of the carousel
  const offset = useSharedValue(-currentIndex * screenWidth)
  const currentJsIndex = useSharedValue(currentIndex)

  // This function is now run on the JS thread for state updates
  const handleIndexChange = useCallback(
    (newIndex: number) => {
      if (newIndex < 0 || newIndex >= items.length) {
        return
      }
      setInternalIndex(newIndex)
      onIndexChange?.(newIndex)
    },
    [items.length, onIndexChange],
  )

  // This centralized function handles all navigation logic
  const animateTo = (newIndex: number) => {
    'worklet'
    // Ensure the new index is within bounds before animating
    const clampedIndex = Math.min(Math.max(newIndex, 0), items.length - 1)
    currentJsIndex.value = clampedIndex
    offset.value = withSpring(-clampedIndex * screenWidth, { damping: 20 })
    runOnJS(handleIndexChange)(clampedIndex)
  }

  // The gesture handler for tapping on an item
  const tapGesture = Gesture.Tap()
    .maxDuration(250) // Prevents long presses from being considered a tap
    .onEnd(() => {
      'worklet'
      // This is where you would call your modal open function on the JS thread
      if (onTapItem) {
        runOnJS(onTapItem)(currentJsIndex.value)
      }
    })

  // The gesture handler has been completely rewritten for reliability
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet'
      // Corrected: The offset is now a direct translation, not a spring animation.
      // This allows the carousel to follow the finger smoothly during the swipe.
      offset.value = -currentJsIndex.value * screenWidth + event.translationX
    })
    .onEnd((event) => {
      'worklet'
      // Calculate the new index based on the final position of the carousel
      // Round to the nearest integer to find the target slide
      const finalOffset = offset.value
      const newIndex = Math.round(-finalOffset / screenWidth)

      // Clamp the index to prevent out-of-bounds
      const clampedIndex = Math.min(Math.max(newIndex, 0), items.length - 1)

      // Animate to the new index and update the JS state
      animateTo(clampedIndex)
    })

  // Combine the pan and tap gestures using Exclusive
  const combinedGesture = Gesture.Exclusive(panGesture, tapGesture)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    }
  })

  const handlePrevious = useCallback(() => {
    // Only allow previous if not on the first slide
    if (currentJsIndex.value > 0) {
      animateTo(currentJsIndex.value - 1)
    }
  }, [items.length])

  const handleNext = useCallback(() => {
    // Only allow next if not on the last slide
    if (currentJsIndex.value < items.length - 1) {
      animateTo(currentJsIndex.value + 1)
    }
  }, [items.length])

  // Use a single useEffect to sync the state on initial load and prop changes
  useEffect(() => {
    if (currentJsIndex.value !== currentIndex) {
      currentJsIndex.value = currentIndex
      offset.value = -currentIndex * screenWidth
      runOnJS(handleIndexChange)(currentIndex)
    }
  }, [currentIndex])

  useEffect(() => {
    if (items.length > 0) {
      animateTo(0)
    }
  }, [items])

  return (
    <View style={[styles.mainContainer, style]} className={className}>
      <View style={styles.carouselContainer} className={carouselContainerClassName}>
        {showNavigation && !hideArrows && (
          <TouchableOpacity onPress={handlePrevious} style={[styles.arrow, styles.leftArrow]}>
            <DoubleChevronLeftIcon width={32} height={32} color="white" />
          </TouchableOpacity>
        )}

        <GestureDetector gesture={combinedGesture}>
          <Animated.View style={styles.contentWrapper}>
            <Animated.View style={[styles.animatedView, { width: screenWidth * items.length }, animatedStyle]}>
              {items.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={{ flex: 1 }}>{item}</View>
                </View>
              ))}
            </Animated.View>
          </Animated.View>
        </GestureDetector>

        {showNavigation && !hideArrows && (
          <TouchableOpacity onPress={handleNext} style={[styles.arrow, styles.rightArrow]}>
            <DoubleChevronRightIcon width={32} height={32} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <FooterNavigation
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        showNavigation={showNavigation}
        dotGroupClass={dotGroupClass}
        items={items}
        hideArrows={hideDotsArrows}
        currentIndex={currentIndex}
        setInternalIndex={handleIndexChange}
        visibleDotsCount={visibleDotsCount}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  carouselContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  animatedView: {
    flexDirection: 'row',
    height: '100%',
  },
  itemContainer: {
    width: screenWidth,
    height: '100%',
  },
  arrow: {
    position: 'absolute',
    padding: 10,
    zIndex: 10,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
})
