import { Input } from '@/components/app-input'
import { GuestsList } from '@/components/guests/guests-list'
import { GuestsProvider } from '@/components/guests/guests-provider'
import { useSearchContext } from '@/components/search/single-property-search-provider'
import WhiteButton from '@/components/ui/Buttons/WhiteButton'
import { GuestDetails } from '@/types/booking.types'
import { XIcon } from 'phosphor-react-native'
import React, { useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

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
    <GuestsProvider>
      <GuestsModalContent 
        guests={guests}
        guestFields={guestFields}
        onFieldChange={handleFieldChange}
        onAddGuest={handleAddGuest}
        onRemoveGuest={handleRemoveGuest}
        onCancel={onCancel}
        onConfirm={onConfirm}
        canProceed={canProceed}
        totalGuests={totalGuests}
      />
    </GuestsProvider>
  )
}

interface GuestsModalContentProps {
  guests: {
    adults: number
    children: number[]
  }
  guestFields: GuestDetails[]
  onFieldChange: (idx: number, field: 'first_name' | 'last_name', value: string) => void
  onAddGuest: () => void
  onRemoveGuest: (idx: number) => void
  onCancel: () => void
  onConfirm: (details: GuestDetails[]) => void
  canProceed: boolean
  totalGuests: number
}

const GuestsModalContent: React.FC<GuestsModalContentProps> = ({ 
  guests,
  guestFields,
  onFieldChange,
  onAddGuest,
  onRemoveGuest,
  onCancel,
  onConfirm,
  canProceed,
  totalGuests
}) => {
  const { selectedGuests, selectGuest, unselectGuest } = useSearchContext()

  const handleUseSavedGuest = (savedGuest: any) => {
    // Check if guest is already selected
    const isAlreadySelected = selectedGuests.some(selected => selected.id === savedGuest.id);
    
    if (isAlreadySelected) {
      // If already selected, unselect them
      handleUnselectGuest(savedGuest);
      return;
    }
    
    // Find the first empty field or create a new one
    const emptyFieldIndex = guestFields.findIndex(field => !field.first_name.trim() && !field.last_name.trim())
    
    let guestWasAdded = false;
    
    if (emptyFieldIndex !== -1) {
      // Fill the empty field
      onFieldChange(emptyFieldIndex, 'first_name', savedGuest.firstName)
      onFieldChange(emptyFieldIndex, 'last_name', savedGuest.lastName)
      guestWasAdded = true;
    } else if (guestFields.length < totalGuests) {
      // Add a new field and fill it
      onAddGuest()
      setTimeout(() => {
        onFieldChange(guestFields.length, 'first_name', savedGuest.firstName)
        onFieldChange(guestFields.length, 'last_name', savedGuest.lastName)
      }, 0)
      guestWasAdded = true;
    }
    
    // Only select the guest if we actually added them to a field
    if (guestWasAdded) {
      selectGuest(savedGuest)
    }
  }

  const handleUnselectGuest = (savedGuest: any) => {
    // Find and clear the field that matches this guest
    const fieldIndex = guestFields.findIndex(field => 
      field.first_name.toLowerCase() === savedGuest.firstName.toLowerCase() &&
      field.last_name.toLowerCase() === savedGuest.lastName.toLowerCase()
    )
    
    if (fieldIndex !== -1) {
      onFieldChange(fieldIndex, 'first_name', '')
      onFieldChange(fieldIndex, 'last_name', '')
    }
    
    unselectGuest(savedGuest)
  }

  return (
    <View className="bg-[#151515] rounded-2xl mx-auto p-6 border border-[#323232] shadow-lg">
      {/* Header */}
      <View className="flex flex-row items-center justify-between pb-2">
        <View className="flex flex-row items-center gap-1 mb-3">
          <View className="w-4 h-4 items-center justify-center rounded">
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
      <View className="flex flex-col pb-4">
        <View className="bg-[#0C1A29] border border-[#364A6C] rounded-2xl p-4 mb-6">
          <Text className="text-xs text-white">
            Please enter guest names exactly as they appear on official documents.
          </Text>
        </View>

        {/* Saved Guests Section */}
        <GuestsList
          mode="selection"
          selectedGuests={selectedGuests}
          onGuestSelect={handleUseSavedGuest}
          onGuestUnselect={handleUnselectGuest}
        />
        <ScrollView className='max-h-[220px]'>
          <Text className="mb-6 text-[22px] font-medium text-center text-white">add guests names</Text>
          {guestFields.map((guest, idx) => (
            <View key={idx} className="mb-4">
              <Text className="mb-2 text-sm font-medium text-white">guest {idx + 1}</Text>
              <View className="flex-row gap-2 items-center justify-center">
                <View className="flex-1">
                  <Input
                    placeholder="first name"
                    value={guest.first_name}
                    onChangeText={(val) => onFieldChange(idx, 'first_name', val)}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    placeholder="last name"
                    value={guest.last_name}
                    onChangeText={(val) => onFieldChange(idx, 'last_name', val)}
                  />
                </View>
                {guestFields.length > 1 && (
                  <TouchableOpacity onPress={() => onRemoveGuest(idx)}>
                    <XIcon size={16} color='#CA5555' />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {guestFields.length < totalGuests && (
          <View className="mb-6">
            <TouchableOpacity
              onPress={onAddGuest}
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
