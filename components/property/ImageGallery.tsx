import Carousel from '@/components/ui/Carousel/Carousel'
import { groupBy, startCase } from 'lodash'
import { useState } from 'react'
import { FlatList, Image, ScrollView, Text, View } from 'react-native'

interface ImageGalleryProps {
  images: {
    url: string
    categorySlug: string
  }[]
  roomGroups: {
    roomGroupId: number
    images: string[]
    nameStruct: {
      mainName: string
    }
  }[]
}

/**
 * ImageGallery component displays images for each room and a general category.
 * It allows users to switch between different room images using a carousel.
 *
 * @param {Object} images - Array of general images for the property.
 * @param {Array} roomGroups - Array of room groups with their respective images.
 */
export default function ImageGallery({ images, roomGroups }: ImageGalleryProps) {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0)
  let allImages

  if (roomGroups.length === 1) {
    const groupedImages = groupBy(images, 'categorySlug')
    allImages = Object.entries(groupedImages).map(([slug, group]) => ({
      name: slug,
      images: group.map((image) => image.url),
    }))
  } else {
    allImages = [
      {
        name: 'General',
        images: images.map((image) => image.url),
      },
      ...roomGroups.map((room) => ({
        name: room.nameStruct.mainName,
        images: room.images,
      })),
    ].filter((group) => group.images.length > 0)
  }

  const getImageUrl = (image: string) => image.replace('{size}', '1024x768')

  const formatRoomName = (name: string) => {
    if (roomGroups.length > 1) {
      return name
    }

    if (name === 'unspecified') {
      return 'Other'
    }

    return startCase(name)
  }

  const imageElements = allImages[selectedRoomIndex]?.images?.map((image) => (
    <View>
      <Image src={getImageUrl(image)} className="object-contain object-center w-full mx-auto aspect-[3/2]" />
    </View>
  ))

  return (
    <ScrollView className="flex flex-col max-h-[600px]">
      <View className="relative overflow-auto w-full aspect-[3/2]">
        <Carousel
          items={imageElements}
          showNavigation={true}
          hideArrows={true}
          hideDotsArrows={false}
          className="relative flex flex-row w-full h-full"
          carouselContainerClassName="rounded-lg overflow-hidden"
          dotGroupClass="z-10 border-red-500 absolute top-full mt-5 w-full"
        />
      </View>
      {/* Room selection column */}

      <FlatList
        numColumns={2}
        data={allImages}
        scrollEnabled={false}
        className="mt-20"
        columnWrapperStyle={{ gap: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item, index }) => (
          <View
            key={index}
            onTouchStart={() => setSelectedRoomIndex(index)}
            className={`flex flex-col flex-1 rounded-lg bg-[#151515]`}
          >
            <View className="flex flex-col gap-2">
              {!!item.images?.[0] && (
                <View className="aspect-[3/2] rounded-xl overflow-hidden">
                  <Image src={getImageUrl(item.images[0])} alt="" className="object-cover w-full h-full" />
                </View>
              )}
              <Text className="mt-1 text-left line-clamp-1 text-sm font-primary-medium text-white">
                {formatRoomName(item.name)}
              </Text>
            </View>
          </View>
        )}
      />
    </ScrollView>
  )
}
