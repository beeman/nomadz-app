import { GuestsDropdown } from '@/components/ui/SearchBar/GuestsInput/GuestsDropdown'
import React, { useState } from 'react'
import { Text, View } from 'react-native'

interface Guests {
  adults: number
  children: number[]
}

interface GuestNumberInputProps {
  className?: string
  guests: Guests
  onGuestsChange: (guests: Guests) => void
  dropdownPosition?: 'top' | 'bottom'
}

const GuestNumberInput: React.FC<GuestNumberInputProps> = ({
  className,
  guests,
  onGuestsChange,
  dropdownPosition = 'bottom',
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const totalGuests = guests.adults + guests.children.filter((age) => age >= 2).length
  const infantsCount = guests.children.filter((age) => age === 1).length

  return (
    <View className={`relative ${className || ''}`}>
      <View onTouchStart={() => setIsOpen(!isOpen)} className="flex items-center w-full py-2 gap-x-2 rounded-xl">
        <Text className="text-sm font-semibold text-white truncate">guests: {totalGuests}</Text>
      </View>

      {isOpen && (
        <>
          <View className="fixed inset-0" onTouchStart={() => setIsOpen(false)} />
          <GuestsDropdown guests={guests} onGuestsChange={onGuestsChange} position={dropdownPosition} />
        </>
      )}
    </View>
  )
}

export default GuestNumberInput
