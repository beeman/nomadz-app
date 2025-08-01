import { ApartmentInfo } from '../../types/booking.types'
import { RectangleGroupFourIcon } from '../icons/Icons'

interface DesktopImageGridProps {
  property: ApartmentInfo
  onGalleryOpen: () => void
}

export default function DesktopImageGrid({ property, onGalleryOpen }: DesktopImageGridProps) {
  return (
    <View className="hidden md:grid mb-8 relative aspect-[1207/366]">
      {/* First image - 45% width, full height, aspect 1.5 */}
      <View
        onClick={onGalleryOpen}
        className="absolute top-0 left-0 h-full overflow-hidden rounded-lg cursor-pointer aspect-[3/2]"
      >
        <Image
          src={property.images[0]?.url.replace('{size}', '1024x768')}
          alt="Property main view"
          className="object-cover aspect-[3/2] object-center w-full"
        />
      </View>

      {/* Right section - 55% width */}
      <View className="absolute top-0 right-0 flex flex-col h-full aspect-[646/366] justify-between">
        {/* Second image - full width, 60% height, aspect 3 */}
        <View onClick={onGalleryOpen} className="w-full overflow-hidden rounded-lg cursor-pointer aspect-[3/1]">
          <Image
            src={property.images[1]?.url.replace('{size}', '1024x768')}
            alt=""
            className="object-cover aspect-[3] object-center w-fit"
          />
        </View>

        {/* Bottom row - 3 equal images, 40% height */}
        <View className="relative flex space-x-2">
          {property.images.slice(2, 5).map((image, index) => (
            <>
              <View
                key={index}
                onClick={onGalleryOpen}
                className="flex-1 overflow-hidden rounded-lg cursor-pointer aspect-[3/2]"
              >
                <Image
                  src={image.url.replace('{size}', '640x400')}
                  alt={`Property view ${index + 3}`}
                  className="object-cover aspect-[3/2] object-center w-fit"
                />
              </View>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onGalleryOpen()
                }}
                className="absolute bottom-3 right-3 flex items-center space-x-2 bg-[#FCFCFC] rounded-full text-black px-3 py-2"
              >
                <RectangleGroupFourIcon className="size-4" />
                <Text className="text-xs whitespace-nowrap">show all photos</Text>
              </Button>
            </>
          ))}
        </View>
      </View>
    </View>
  )
}
