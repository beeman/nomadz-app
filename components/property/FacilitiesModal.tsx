import Modal from '@/components/ui/Modal'
import { AMENITY_METADATA, DEFAULT_AMENITY_METADATA } from '@/data/amenityMetadata'
import { Text, View } from 'react-native'

interface FacilitiesModalProps {
  isOpen: boolean
  onClose: () => void
  amenities: string[]
}

export default function FacilitiesModal({ isOpen, onClose, amenities }: FacilitiesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View className="max-w-[800px] max-h-[90dvh] bg-[#121212] rounded-2xl overflow-y-auto no-scrollbar border border-[#313131]">
        {/* Modal Header */}
        <View className="relative flex items-center px-8 pt-8">
          <Text className="flex-1 text-xl font-medium text-left text-white sm:text-2xl">all facilities</Text>
        </View>

        {/* Modal Body */}
        <View className="p-8">
          <View className="flex flex-col gap-4">
            {amenities.map((amenity, index) => {
              const metadata = AMENITY_METADATA[amenity] || DEFAULT_AMENITY_METADATA
              const IconComponent = metadata.icon as any

              return (
                <View key={index} className="p-6 rounded-lg bg-[#1A1A1A] border border-[#292929]">
                  <View className="flex flex-row items-center gap-3 mb-2">
                    <IconComponent width={24} height={24} color="white" />
                    <Text className="font-primary-medium text-left">{amenity}</Text>
                  </View>
                  <Text className="text-xs text-white">{metadata.description}</Text>
                </View>
              )
            })}
          </View>
        </View>
      </View>
    </Modal>
  )
}
