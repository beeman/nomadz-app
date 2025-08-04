import MobileHeader from '@/components/property/MobileHeader'
import Carousel from '@/components/ui/Carousel/Carousel'
import { ApartmentInfo } from '@/types/booking.types'
import React from 'react'
import { Image, View } from 'react-native'

interface MobileImageGalleryProps {
  property: ApartmentInfo
  onGalleryOpen: () => void
}

export default function MobileImageGallery({ property, onGalleryOpen }: MobileImageGalleryProps) {
  return (
    <View className="flex flex-row flex-1">
      <View className="relative flex flex-col w-full justify-between gap-4 !aspect-[587/367]">
        <MobileHeader property={property} />
        <View className="flex flex-row w-full relative h-full overflow-hidden rounded-lg cursor-pointer">
          <Carousel
            items={property.images.slice(0, 5).map((image, index) => (
              <View className="flex flex-row w-full h-full" key={index}>
                <Image
                  src={image.url?.replace('{size}', '640x640')}
                  alt={`Property view ${index + 1}`}
                  className="object-cover w-full h-full !aspect-[587/367]"
                />
              </View>
            ))}
            showNavigation={true}
            hideArrows={true}
            onTapItem={() => onGalleryOpen()}
            className="relative flex flex-row w-full h-full"
            dotGroupClass="z-10 absolute bottom-1.5 left-1/2 -translate-x-1/2 mb-2 "
          />
        </View>
      </View>
    </View>
  )
}
