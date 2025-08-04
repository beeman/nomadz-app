import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Text, View } from 'react-native'

interface GuestTypeInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  description?: string
}

const GuestTypeInput: React.FC<GuestTypeInputProps> = ({ label, value, onChange, min = 0, max = 10, description }) => {
  return (
    <View className="flex items-center justify-between py-4 gap-x-8">
      <View>
        <Text className="font-medium text-white">{label}</Text>
        {description && <Text className="text-sm text-[#8A8A8A]">{description}</Text>}
      </View>
      <View className="flex items-center gap-x-3">
        <View
          onTouchStart={() => value > min && onChange(value - 1)}
          className={`flex items-center justify-center size-6 rounded-full border border-white ${
            value <= min ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <MinusIcon className="text-white size-3" />
        </View>

        <Text className="w-4 text-center text-white">{value}</Text>

        <View
          onTouchStart={() => value < max && onChange(value + 1)}
          className={`flex items-center justify-center size-6 rounded-full border border-white ${
            value >= max ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <PlusIcon className="text-white size-3" />
        </View>
      </View>
    </View>
  )
}

export default GuestTypeInput
