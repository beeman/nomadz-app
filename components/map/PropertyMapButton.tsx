import { useCallback, useEffect, useState } from 'react'
import { ApartmentsItemInfo } from '../../types/booking.types'
import { formatPrice, getLowestPriceWithCommission } from '../../utils/rate.utils'
import StayCard from '../stays/StayCard'

interface PropertyMapButtonProps {
  property: ApartmentsItemInfo
  isOpen: boolean
  onClick: () => void
  map?: google.maps.Map | null
}

export default function PropertyMapButton({ property, isOpen, onClick, map }: PropertyMapButtonProps) {
  const [position, setPosition] = useState<{ top: boolean; left: boolean; center: boolean } | null>(null)

  const checkPosition = useCallback(() => {
    if (!map) {
      console.log('Map is missing.')
      return
    }

    const bounds = map.getBounds()
    if (!bounds) {
      console.log('Bounds are missing.')
      return
    }

    // Check vertical position
    const topLat = bounds.getNorthEast().lat()
    const bottomLat = bounds.getSouthWest().lat()
    const midLat = (topLat + bottomLat) / 2
    const showOnTop = property.latitude < midLat

    // Check horizontal position
    const leftLng = bounds.getSouthWest().lng()
    const rightLng = bounds.getNorthEast().lng()
    const totalWidth = rightLng - leftLng

    // Split into three sections: 25% | 50% | 25%
    const leftSection = leftLng + totalWidth * 0.25
    const rightSection = rightLng - totalWidth * 0.25

    let isLeft = false
    let isCenter = false

    if (property.longitude < leftSection) {
      isLeft = true
      isCenter = false
    } else if (property.longitude > rightSection) {
      isLeft = false
      isCenter = false
    } else {
      isLeft = false
      isCenter = true
    }

    setPosition({
      top: showOnTop,
      left: isLeft,
      center: isCenter,
    })
  }, [map, property.latitude, property.longitude])

  useEffect(() => {
    if (isOpen) {
      checkPosition()
    } else {
      setPosition(null)
    }
  }, [isOpen, checkPosition])

  // Get the lowest price from rates if available
  const getLowestPrice = (): number | string => {
    if (!property.rates || property.rates.length === 0) {
      return 'N/A'
    }

    const price = getLowestPriceWithCommission(property.rates)
    return price > 0 ? price : 'N/A'
  }

  return (
    <View className="relative">
      {/* Price Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className="px-3 py-0.5 text-xs font-secondary font-medium text-black transition-transform bg-white rounded-full shadow-[0px_4px_4px_0px_#00000040] cursor-pointer w-fit hover:scale-105"
      >
        ${typeof getLowestPrice() === 'number' ? formatPrice(getLowestPrice() as number) : getLowestPrice()}
      </Button>

      {/* Property Modal */}
      {isOpen && position && (
        <View
          className={`
            absolute z-10 w-[286px]
            ${position.top ? 'bottom-full mb-2' : 'top-full mt-2'}
            ${position.center ? 'left-1/2 -translate-x-1/2' : position.left ? 'left-0' : 'right-0'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <StayCard stay={property} variant="horizontal" className="h-[122px]" />
        </View>
      )}
    </View>
  )
}
