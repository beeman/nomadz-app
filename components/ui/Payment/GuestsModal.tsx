import { Input } from '@/components/app-input'
import WhiteButton from '@/components/ui/Buttons/WhiteButton'
import { GuestDetails } from '@/types/booking.types'
import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const logoNomadz = require('@/assets/pngs/icons/logo-white.png')

interface GuestsModalProps {
  guests: {
    adults: number
    children: number[]
  }
  onCancel: () => void
  onConfirm: (details: GuestDetails[]) => void
}

const GuestsModal: React.FC<GuestsModalProps> = ({ guests, onCancel, onConfirm }) => {
  const totalGuests = guests.adults + guests.children.length
  const [guestFields, setGuestFields] = useState<GuestDetails[]>(
    Array.from({ length: totalGuests }, (_, i) => ({
      first_name: '',
      last_name: '',
      is_child: i >= guests.adults,
    })),
  )

  const handleFieldChange = (idx: number, field: 'first_name' | 'last_name', value: string) => {
    setGuestFields((fields) => fields.map((g, i) => (i === idx ? { ...g, [field]: value } : g)))
  }

  const handleAddGuest = () => {
    if (guestFields.length < totalGuests) {
      setGuestFields((fields) => [
        ...fields,
        { first_name: '', last_name: '', is_child: fields.length >= guests.adults },
      ])
    }
  }

  const handleRemoveGuest = (idx: number) => {
    setGuestFields((fields) => fields.filter((_, i) => i !== idx))
  }

  const canProceed = guestFields.every((g) => g.first_name.trim() && g.last_name.trim())

  return (
    <View className="bg-[#151515] rounded-2xl px-6 mx-auto p-6 border border-[#323232] shadow-lg">
      {/* Header */}
      <View className="flex flex-row items-center justify-between pb-2">
        <View className="flex flex-row items-center gap-1 mb-3 border">
          <View className="w-4 h-4 items-center justify-center bg-black rounded border border-[#4B4B4B]">
            <Image source={logoNomadz} resizeMode="contain" style={{ height: 10, width: 10, alignSelf: 'center' }} />
          </View>
          <View className="flex-row items-center">
            <Text className="text-[11px] text-[#999999] font-medium">Nomadz</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onCancel}>
          <Text className="text-alert-red text-sm bg-[#15151580] rounded-full px-2 py-1">cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <View className="flex flex-col gap-5 pb-4">
        <View className="bg-[#0C1A29] border border-[#364A6C] rounded-2xl p-4 mb-6">
          <Text className="text-xs text-white">
            Please enter guest names exactly as they appear on official documents.
          </Text>
        </View>

        <Text className="mb-6 text-[22px] font-medium text-center text-white">add guests names</Text>

        {guestFields.map((guest, idx) => (
          <View key={idx} className="mb-6">
            <Text className="mb-2 text-sm font-medium text-white">guest {idx + 1}</Text>
            <View className="flex-row gap-2 items-center">
              <View className="flex-1">
                <Input
                  placeholder="first name"
                  value={guest.first_name}
                  onChangeText={(val) => handleFieldChange(idx, 'first_name', val)}
                  className="rounded-xl border border-[#323232] bg-[#151515] placeholder:text-[#CDCDCD80]"
                />
              </View>
              <View className="flex-1">
                <Input
                  placeholder="last name"
                  value={guest.last_name}
                  onChangeText={(val) => handleFieldChange(idx, 'last_name', val)}
                  className="rounded-xl border border-[#323232] bg-[#151515] placeholder:text-[#CDCDCD80]"
                />
              </View>
              {guestFields.length > 1 && (
                <TouchableOpacity onPress={() => handleRemoveGuest(idx)}>
                  <Text className="text-[#CA5555] text-lg px-2">×</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {guestFields.length < totalGuests && (
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleAddGuest}
              className="w-full border border-dashed border-[#444] rounded-xl py-3 items-center"
            >
              <Text className="text-[#B0B0B0]">
                + add guest ({guestFields.length}/{totalGuests})
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Confirm Button */}
      <View className="pt-4">
        <WhiteButton
          size="lg"
          className="bg-white rounded-full"
          onClick={() => onConfirm(guestFields)}
          disabled={!canProceed}
        >
          <Text className="text-black text-primary-medium">proceed to payment</Text>
        </WhiteButton>
      </View>
    </View>
  )
}

export default GuestsModal
