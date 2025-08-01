import { ApartmentInfo } from '../../types/booking.types'
import Carousel from '../Carousel/Carousel'
import MobileHeader from './MobileHeader'

interface MobileImageGalleryProps {
  property: ApartmentInfo
  onGalleryOpen: () => void
}

export default function MobileImageGallery({ property, onGalleryOpen }: MobileImageGalleryProps) {
  return (
    <View className="flex-1 md:hidden">
      <View className="relative flex flex-col justify-between gap-4">
        <MobileHeader property={property} />
        <View className="relative h-full overflow-hidden rounded-lg cursor-pointer">
          <View className="md:hidden">
            <Carousel
              items={property.images.slice(0, 5).map((image, index) => (
                <Image
                  key={index}
                  src={image.url?.replace('{size}', '640x640')}
                  alt={`Property view ${index + 1}`}
                  className="object-cover w-full h-full !aspect-[587/367]"
                  onClick={onGalleryOpen}
                />
              ))}
              showNavigation={false}
              className="relative"
              dotGroupClass="z-10 absolute bottom-1.5 left-1/2 -translate-x-1/2"
            />
          </View>
        </View>
      </View>
    </View>
  )
}
