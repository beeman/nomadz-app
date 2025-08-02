import GuestTypeInput from '@/components/ui/SearchBar/GuestsInput/GuestTypeInput'
import React from 'react'
import { View } from 'react-native'

interface Guests {
  adults: number
  children: number[]
}

interface GuestsDropdownProps {
  guests: Guests
  onGuestsChange: (guests: Guests) => void
  position?: 'top' | 'bottom'
}

export const GuestsDropdown: React.FC<GuestsDropdownProps> = ({ guests, onGuestsChange, position = 'bottom' }) => {
  const handleAdultsChange = (newValue: number) => {
    onGuestsChange({
      ...guests,
      adults: newValue,
    })
  }

  const handleChildrenChange = (type: 1 | 12, value: number) => {
    const currentChildren = [...guests.children]
    const currentCount = currentChildren.filter((age) => age === type).length

    if (value > currentCount) {
      // Add more children of this type
      const toAdd = value - currentCount
      for (let i = 0; i < toAdd; i++) {
        currentChildren.push(type)
      }
    } else if (value < currentCount) {
      // Remove children of this type
      const toRemove = currentCount - value
      for (let i = 0; i < toRemove; i++) {
        const index = currentChildren.lastIndexOf(type)
        if (index !== -1) {
          currentChildren.splice(index, 1)
        }
      }
    }

    onGuestsChange({
      ...guests,
      children: currentChildren,
    })
  }

  const getTypeCount = (type: number): number => {
    return guests.children.filter((age) => age === type).length
  }

  const positionClass = position === 'top' ? 'bottom-full mt-2' : 'top-full mb-2'

  return (
    <View
      className={`absolute ${positionClass} bg-[#1B1B1B] rounded-xl p-4 border border-[#2F2F2F] shadow-lg z-50 left-1/2 -translate-x-1/2`}
    >
      <GuestTypeInput
        label="adults"
        value={guests.adults}
        onChange={handleAdultsChange}
        min={1}
        description="ages 13 or above"
      />

      <GuestTypeInput
        label="children"
        value={getTypeCount(12)}
        onChange={(value) => handleChildrenChange(12, value)}
        description="ages 2-12"
      />

      <GuestTypeInput
        label="infants"
        value={getTypeCount(1)}
        onChange={(value) => handleChildrenChange(1, value)}
        description="under 2"
      />
    </View>
  )
}
