import { useCallback, useEffect, useRef, useState } from 'react'

interface PriceRangeProps {
  distribution: Record<number, number>
  onChange?: (range: { min: number; max: number | null }) => void
  initialRange?: { min: number; max: number | null }
}

interface RangeValues {
  min: number
  max: number | null
}

interface InputValues {
  min: string | number
  max: string | number | null
}

export default function PriceRange({ distribution, onChange, initialRange }: PriceRangeProps) {
  const prices = Object.keys(distribution).map(Number)
  const minPrice = 0
  const maxPrice = Math.max(...prices)
  const values = Object.values(distribution)
  const maxHeight = Math.max(...values)

  const containerRef = useRef<HTMLDivElement>(null)
  const rangeRef = useRef(initialRange || { min: minPrice, max: maxPrice })
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
  const [range, setRange] = useState<RangeValues>({
    min: initialRange?.min || minPrice,
    max: initialRange?.max || maxPrice,
  })
  const [inputValues, setInputValues] = useState<InputValues>({ min: range.min, max: range.max })

  const updateRangeAndNotify = useCallback(
    (newRange: RangeValues, maxPricePresent: boolean = true) => {
      console.log({ newRange, maxPricePresent })
      setRange({ ...newRange, max: maxPricePresent ? newRange.max : null })
      rangeRef.current = newRange
      onChange?.({
        ...newRange,
        max: maxPricePresent ? newRange.max : null,
      })
    },
    [onChange],
  )

  const handleMouseDown = (handle: 'min' | 'max') => {
    setIsDragging(handle)
  }

  const calculatePrice = useCallback(
    (clientX: number): number => {
      if (!containerRef.current) return minPrice

      const rect = containerRef.current.getBoundingClientRect()
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const price = minPrice + (maxPrice - minPrice) * percentage
      return Math.round(price)
    },
    [minPrice, maxPrice, containerRef],
  )

  const handleMouseMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return
      const newPrice = calculatePrice(e.clientX)
      const prevRange = rangeRef.current

      const updated = {
        min: isDragging === 'min' ? Math.min(newPrice, prevRange.max || Number.MAX_VALUE) : prevRange.min,
        max: isDragging === 'max' ? Math.max(newPrice, prevRange.min) : prevRange.max,
      }

      console.log('newPrice === maxPrice', newPrice === maxPrice, newPrice, maxPrice)
      updateRangeAndNotify(updated, updated.max !== maxPrice)
    },
    [isDragging, calculatePrice, updateRangeAndNotify],
  )

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handleMouseMove)
      window.addEventListener('pointerup', handleMouseUp)
      return () => {
        window.removeEventListener('pointermove', handleMouseMove)
        window.removeEventListener('pointerup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove])

  const getBarColor = (price: number) => {
    return price >= range.min && price <= (range.max !== null ? range.max : maxPrice) ? 'bg-[#FDFDFD]' : 'bg-[#A8A8A8]'
  }

  const getHandlePosition = (price: number) => {
    return Math.min(100, ((price - minPrice) / (maxPrice - minPrice)) * 100)
  }

  const handleInputChange = (value: string, type: 'min' | 'max') => {
    if (!+value) {
      return
    }
    setInputValues((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const handleInputBlur = (type: 'min' | 'max') => {
    const inputValue = String(inputValues[type])
    const value = Number(inputValue)

    if (inputValue === '' || isNaN(value) || value < minPrice) {
      setInputValues((prev) => ({
        ...prev,
        [type]: range[type],
      }))
      return
    }

    const updated = {
      min: type === 'min' ? Math.min(value, range.max) : range.min,
      max: type === 'max' ? Math.max(value, range.min) : range.max,
    }

    updateRangeAndNotify(updated)
    setInputValues({
      min: updated.min,
      max: updated.max,
    })
  }

  // Sync input values with range
  useEffect(() => {
    setInputValues({
      min: range.min,
      max: range.max,
    })
  }, [range])

  // Sync range with initialRange prop
  useEffect(() => {
    if (initialRange) {
      const newRange = {
        min: initialRange.min !== null ? Math.max(minPrice, initialRange.min) : range.min,
        max: initialRange.max,
      }
      setRange(newRange)
      rangeRef.current = newRange
      setInputValues({
        min: newRange.min,
        max: newRange.max,
      })
    }
  }, [initialRange, minPrice, range.min, range.max])

  return (
    <View className="w-full">
      {/* Distribution Graph */}
      <View className="relative h-16 mb-4" ref={containerRef}>
        <View className="absolute inset-0 flex items-end justify-between gap-0.5">
          {Object.entries(distribution).map(([price, count]) => {
            const height = count ? Math.max((count / maxHeight) * 100, 1) : 0
            return (
              <View key={price} className={`w-full ${getBarColor(Number(price))}`} style={{ height: `${height}%` }} />
            )
          })}
        </View>

        {/* Slider Handles */}
        <View
          className="absolute top-auto -ml-3 cursor-pointer -bottom-2.5"
          style={{ left: `${getHandlePosition(range.min)}%` }}
          onPointerDown={() => handleMouseDown('min')}
        >
          <View className="size-[18px] bg-white border-2 border-[#58F0B8] rounded-full shadow-lg" />
        </View>
        <View
          className="absolute top-auto -ml-3 cursor-pointer -bottom-2.5"
          style={{ left: `${getHandlePosition(range.max !== null ? range.max : maxPrice)}%` }}
          onPointerDown={() => handleMouseDown('max')}
        >
          <View className="size-[18px] bg-white border-2 border-[#58F0B8] rounded-full shadow-lg" />
        </View>
      </View>

      {/* Price Number Inputs */}
      <View className="flex justify-between">
        <View className="text-center">
          <View className="mb-0.5 text-xs text-[#ffffffa2]">min</View>
          <View className="relative">
            <input
              type="number"
              value={inputValues.min}
              onChange={(e) => handleInputChange(e.target.value, 'min')}
              onBlur={() => handleInputBlur('min')}
              min={minPrice}
              max={range.max}
              className="w-[100px] bg-[#1B1B1B] text-white rounded-full py-1.5 px-2 text-center border border-[#ffffff80] focus:outline-none focus:border-[#58F0B8]"
            />
          </View>
        </View>
        <View className="text-center">
          <View className="mb-0.5 text-xs text-[#ffffffa2]">max</View>
          <View className="relative">
            <input
              type="string"
              value={inputValues.max !== null ? inputValues.max : `${maxPrice}+`}
              onChange={(e) => handleInputChange(e.target.value, 'max')}
              onBlur={() => handleInputBlur('max')}
              min={range.min}
              className="w-[100px] bg-[#1B1B1B] text-white rounded-full py-1.5 px-2 text-center border border-[#ffffff80] focus:outline-none focus:border-[#58F0B8]"
            />
          </View>
        </View>
      </View>
    </View>
  )
}
