import { HouseFilledIcon } from '@/components/icons/Icons'
import PropertyMap from '@/components/map/PropertyMap'
import { FlatList, Text, View } from 'react-native'

interface LocationSectionProps {
  property: any // Update type when available
}

export default function LocationSection({ property }: LocationSectionProps) {
  return (
    <View className="flex flex-1 flex-col gap-y-6 box-bordermb-[10px]">
      <Text className="text-2xl text-left text-white mb-6 font-primary-medium">location</Text>
      <View className="border border-[#313131] box-border rounded-xl bg-[#151515] overflow-hidden">
        <View className="h-[350px]">
          <PropertyMap latitude={property.latitude} longitude={property.longitude} />
        </View>
        {!!property.pois.length && (
          <View className="p-8 h-min rounded-b-[11px]">
            <Text className="mb-4 font-semibold text-white">nearest public facilities</Text>
            <FlatList
              numColumns={2}
              data={property.pois?.slice(0, 4)}
              scrollEnabled={false}
              columnWrapperStyle={{ gap: '4em' }}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              renderItem={({ item, index }) => (
                <View key={index} className="flex flex-row flex-1 gap-3 items-center text-sm">
                  <HouseFilledIcon color="#7D7F88" className="shrink-0" />
                  <View className="flex flex-col flex-1 h-full relative justify-start">
                    <Text className="flex flex-col font-primary-semibold text-wrap text-white line-clamp-2">
                      {item.name}
                    </Text>
                    <Text className="text-[#7D7F88]">{item.distanceInMeters}m</Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </View>
  )
}
