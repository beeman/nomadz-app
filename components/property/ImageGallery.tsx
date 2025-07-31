import { groupBy, startCase } from 'lodash';
import { useState } from 'react';
import Carousel from '../Carousel/Carousel';

interface ImageGalleryProps {
  images: {
    url: string;
    categorySlug: string;
  }[];
  roomGroups: {
    roomGroupId: number;
    images: string[];
    nameStruct: {
      mainName: string;
    };
  }[];
}

/**
 * ImageGallery component displays images for each room and a general category.
 * It allows users to switch between different room images using a carousel.
 * 
 * @param {Object} images - Array of general images for the property.
 * @param {Array} roomGroups - Array of room groups with their respective images.
 */
export default function ImageGallery({ images, roomGroups }: ImageGalleryProps) {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);
  let allImages;

  if (roomGroups.length === 1) {
    const groupedImages = groupBy(images, 'categorySlug');
    allImages = Object.entries(groupedImages).map(([slug, group]) => ({
      name: slug,
      images: group.map(image => image.url),
    }));
  } else {
    allImages = [
      {
        name: 'General',
        images: images.map(image => image.url),
      },
      ...roomGroups.map(room => ({
        name: room.nameStruct.mainName,
        images: room.images,
      })),
    ].filter(group => group.images.length > 0);
  }

  const getImageUrl = (image: string) => image.replace('{size}', '1024x768');

  const formatRoomName = (name: string) => {
    if (roomGroups.length > 1) {
      return name;
    }
    
    if (name === 'unspecified') {
      return 'Other'
    }

    return startCase(name)
  }
  
  const imageElements = allImages[selectedRoomIndex]?.images?.map(image => (
    <View>
      <img src={getImageUrl(image)} className='object-contain object-center w-full mx-auto aspect-[3/2]' />
    </View>
  ))

  console.log('allImages', allImages[1])

  return (
    <View className="flex max-xl:flex-col text-white max-h-full xl:max-h-[80dvh] overflow-hidden max-xl:space-y-8">
      <View className="relative overflow-auto max-xl:max-h-2/3 xl:flex-1 max-sm:shrink-0">
        <Carousel
          items={imageElements}
          className='flex flex-col justify-center h-full'
          contentClassName='overflow-hidden'
        />
      </View>

      {/* Room Selection Column */}
      <View className="px-4 xl:overflow-y-auto xl:w-1/3 no-scrollbar max-sm:overflow-y-auto">
        <View className='grid grid-cols-2 sm:flex gap-x-3 xl:gap-x-[34px] xl:gap-y-3.5 xl:flex-1 max-xl:overflow-x-auto xl:grid xl:grid-cols-2 no-scrollbar max-sm:gap-2'>
          {allImages.map((room, index) => (
            <button
              key={index}
              onClick={() => setSelectedRoomIndex(index)}
              className={`rounded-lg bg-[#151515] sm:max-xl:min-w-40 h-fit`}
            >
              <View>
                {!!room.images?.[0] && (
                  <View className="aspect-[3/2] overflow-hidden rounded">
                    <img
                      src={getImageUrl(room.images[0])}
                      alt=""
                      className="object-cover w-full h-full"
                    />
                  </View>
                )}
                <Text className="mt-1 text-sm text-left sm:mt-3 line-clamp-1 max-sm:text-xs">{formatRoomName(room.name)}</Text>
              </View>
            </button>
          ))}
        </View>
      </View>
    </View>
  );
}
