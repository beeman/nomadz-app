// components/search/price-range.tsx
import React, { useCallback, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { useAppThemeSpacing } from '../use-app-theme-spacing'

interface PriceRangeProps {
  onChange?: (range: { min: number; max: number | null }) => void
  initialRange?: { min: number; max: number | null }
}

interface RangeValues {
  min: number
  max: number | null
}

interface InputValues {
  min: number
  max: number | null
}

export default function PriceRange({ onChange, initialRange }: PriceRangeProps) {
  const spacing = useAppThemeSpacing()
  const minPrice = 0
  const maxPrice = 350
  
  const [range, setRange] = useState<RangeValues>({ 
    min: initialRange?.min || minPrice, 
    max: initialRange?.max || null // Default to null (350+)
  })
  const [inputValues, setInputValues] = useState<InputValues>({ 
    min: range.min, 
    max: range.max 
  })
  const [containerWidth, setContainerWidth] = useState(0)
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
  
  const updateRangeAndNotify = useCallback((newRange: RangeValues) => {
    // If max is at maxPrice, set it to null and show "350+"
    const updatedRange = {
      ...newRange,
      max: newRange.max === maxPrice ? null : newRange.max
    }
    setRange(updatedRange)
    onChange?.(updatedRange)
  }, [onChange, maxPrice])

  const getHandlePosition = useCallback((price: number) => {
    return Math.min(100, ((price - minPrice) / (maxPrice - minPrice)) * 100)
  }, [minPrice, maxPrice])

  const handleGestureEvent = useCallback((translationX: number, handle: 'min' | 'max') => {
    if (containerWidth === 0) return
    
    // Calculate the new position based on translation
    const currentPosition = handle === 'min' ? getHandlePosition(range.min) : getHandlePosition(range.max !== null ? range.max : maxPrice)
    const newPosition = Math.max(0, Math.min(100, currentPosition + (translationX / containerWidth) * 100))
    const newPrice = minPrice + (maxPrice - minPrice) * (newPosition / 100)
    const snappedPrice = Math.round(newPrice) // Snap to 1-step intervals

    // Limit min handle based on current max value
    const currentMax = range.max !== null ? range.max : 340 // Limit to 340 when max is null (350+)
    const limitedMinPrice = handle === 'min' ? Math.min(snappedPrice, currentMax) : range.min
    const limitedMaxPrice = handle === 'max' ? Math.max(snappedPrice, range.min) : range.max

    const updated = {
      min: limitedMinPrice,
      max: limitedMaxPrice
    }

    updateRangeAndNotify(updated)
  }, [containerWidth, range, maxPrice, minPrice, getHandlePosition, updateRangeAndNotify])

  const handleInputChange = (value: string, type: 'min' | 'max') => {
    if (!+value) return
    setInputValues(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const handleInputBlur = (type: 'min' | 'max') => {
    const inputValue = String(inputValues[type])
    const value = Number(inputValue)
    
    if (inputValue === '' || isNaN(value) || value < minPrice) {
      setInputValues(prev => ({
        ...prev,
        [type]: range[type]
      }))
      return
    }

    // Limit min based on current max value
    const currentMax = range.max !== null ? range.max : 340 // Limit to 340 when max is null (350+)
    const limitedValue = type === 'min' ? Math.min(value, currentMax) : Math.max(value, range.min)

    const updated = {
      min: type === 'min' ? limitedValue : range.min,
      max: type === 'max' ? limitedValue : range.max
    }

    updateRangeAndNotify(updated)
    setInputValues({
      min: updated.min,
      max: updated.max
    })
  }

  // Sync input values with range
  React.useEffect(() => {
    setInputValues({
      min: range.min,
      max: range.max
    })
  }, [range])

  // Create gesture handlers
  const minHandleGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(setIsDragging)('min')
    })
    .onUpdate((event) => {
      runOnJS(handleGestureEvent)(event.translationX, 'min')
    })
    .onEnd(() => {
      runOnJS(setIsDragging)(null)
    })

  const maxHandleGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(setIsDragging)('max')
    })
    .onUpdate((event) => {
      runOnJS(handleGestureEvent)(event.translationX, 'max')
    })
    .onEnd(() => {
      runOnJS(setIsDragging)(null)
    })

  return (
    <GestureHandlerRootView style={{ width: '100%' }}>
      <View style={{ width: '100%' }}>
        {/* Slider Container */}
        <View 
          onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width - spacing.lg * 2)}
          style={{ 
            position: 'relative', 
            height: 80,
            backgroundColor: '#1B1B1B',
            borderRadius: 12,
            padding: spacing.lg,
            justifyContent: 'center',
          }}
        >
          {/* Slider Track */}
          <View style={{
            position: 'absolute',
            left: spacing.lg,
            right: spacing.lg,
            height: 4,
            backgroundColor: '#A8A8A8',
            borderRadius: 2,
          }} />

          {/* Selected Range Track */}
          <View style={{
            position: 'absolute',
            left: `${getHandlePosition(range.min)}%`,
            right: `${100 - getHandlePosition(range.max !== null ? range.max : maxPrice)}%`,
            height: 4,
            backgroundColor: '#FDFDFD',
            borderRadius: 2,
            marginLeft: spacing.lg,
            marginRight: spacing.lg,
          }} />

          {/* Slider Handles */}
          <GestureDetector gesture={minHandleGesture}>
            <View style={{
              position: 'absolute',
              left: `${getHandlePosition(range.min)}%`,
              marginLeft: 10,
              width: 20,
              height: 20,
              backgroundColor: '#FFFFFF',
              borderWidth: 2,
              borderColor: '#58F0B8',
              borderRadius: 10,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }} />
          </GestureDetector>

          <GestureDetector gesture={maxHandleGesture}>
            <View style={{
              position: 'absolute',
              left: `${getHandlePosition(range.max !== null ? range.max : maxPrice)}%`,
              marginLeft: 10,
              width: 20,
              height: 20,
              backgroundColor: '#FFFFFF',
              borderWidth: 2,
              borderColor: '#58F0B8',
              borderRadius: 10,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }} />
          </GestureDetector>
        </View>

        {/* Price Number Inputs */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ 
              marginBottom: spacing.sm, 
              fontSize: 12, 
              color: '#ffffffa2',
              fontWeight: '500',
            }}>
              min
            </Text>
            <TextInput
              style={{
                width: 110,
                backgroundColor: '#1B1B1B',
                color: '#FFFFFF',
                borderRadius: 20,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                textAlign: 'center',
                borderWidth: 1,
                borderColor: '#ffffff80',
                fontSize: 14,
                fontWeight: '500',
              }}
              value={String(inputValues.min)}
              onChangeText={(value) => handleInputChange(value, 'min')}
              onBlur={() => handleInputBlur('min')}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#A0A0A0"
            />
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ 
              marginBottom: spacing.sm, 
              fontSize: 12, 
              color: '#ffffffa2',
              fontWeight: '500',
            }}>
              max
            </Text>
            <TextInput
              style={{
                width: 110,
                backgroundColor: '#1B1B1B',
                color: '#FFFFFF',
                borderRadius: 20,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                textAlign: 'center',
                borderWidth: 1,
                borderColor: '#ffffff80',
                fontSize: 14,
                fontWeight: '500',
              }}
              value={range.max !== null ? String(inputValues.max) : `${maxPrice}+`}
              onChangeText={(value) => handleInputChange(value, 'max')}
              onBlur={() => handleInputBlur('max')}
              keyboardType="numeric"
              placeholder={`${maxPrice}+`}
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}
