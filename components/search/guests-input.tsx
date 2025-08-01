import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'

interface Guests {
  adults: number
  children: number[]
  infants: number
}

interface GuestsInputProps {
  guests: Guests
  onGuestsChange: (guests: Guests) => void
}

export function GuestsInput({ guests, onGuestsChange }: GuestsInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const spacing = useAppThemeSpacing()

  const totalGuests = guests.adults + guests.children.length
  const canAddAdults = (guests.adults + guests.children.length) < 16
  const canAddChildren = (guests.adults + guests.children.length) < 16
  const canAddInfants = guests.infants < 5

  const handleAdultsChange = (newAdults: number) => {
    if (newAdults >= 1 && (newAdults + guests.children.length) <= 16) {
      onGuestsChange({ ...guests, adults: newAdults })
    }
  }

  const handleChildrenChange = (newChildrenCount: number) => {
    if (newChildrenCount >= 0 && (guests.adults + newChildrenCount) <= 16) {
      // Create array of children with default age 12
      const newChildren = Array(newChildrenCount).fill(12)
      onGuestsChange({ ...guests, children: newChildren })
    }
  }

  const handleInfantsChange = (newInfants: number) => {
    if (newInfants >= 0 && newInfants <= 5) {
      onGuestsChange({ ...guests, infants: newInfants })
    }
  }

  return (
    <View style={{ position: 'relative' }}>
      {/* Guests Button */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={{
          backgroundColor: '#1B1B1B',
          borderRadius: 12,
          padding: spacing.md,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: '#292929',
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
          guests: {totalGuests}
        </Text>
      </TouchableOpacity>

      {/* Guests Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xl,
            paddingBottom: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: '#292929',
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>
              Guests
            </Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={{ flex: 1, padding: spacing.lg }}>
            {/* Adults */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: '#292929',
            }}>
              <View>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                  adults
                </Text>
                <Text style={{ color: '#A0A0A0', fontSize: 14 }}>
                  ages 13 or above
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => handleAdultsChange(guests.adults - 1)}
                  disabled={guests.adults <= 1}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: guests.adults <= 1 ? '#666666' : '#FFFFFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: guests.adults <= 1 ? 0.5 : 1,
                  }}
                >
                  <Ionicons 
                    name="remove" 
                    size={20} 
                    color={guests.adults <= 1 ? '#666666' : '#FFFFFF'} 
                  />
                </TouchableOpacity>
                <Text style={{ 
                  color: '#FFFFFF', 
                  fontSize: 18, 
                  fontWeight: 'bold',
                  marginHorizontal: spacing.md,
                  minWidth: 30,
                  textAlign: 'center',
                }}>
                  {guests.adults}
                </Text>
                <TouchableOpacity
                  onPress={() => handleAdultsChange(guests.adults + 1)}
                  disabled={!canAddAdults}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: !canAddAdults ? '#666666' : '#FFFFFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: !canAddAdults ? 0.5 : 1,
                  }}
                >
                  <Ionicons name="add" size={20} color={!canAddAdults ? '#666666' : '#FFFFFF'} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Children */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: '#292929',
            }}>
              <View>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                  children
                </Text>
                <Text style={{ color: '#A0A0A0', fontSize: 14 }}>
                  ages 2-12
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => handleChildrenChange(guests.children.length - 1)}
                  disabled={guests.children.length <= 0}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: guests.children.length <= 0 ? '#666666' : '#FFFFFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: guests.children.length <= 0 ? 0.5 : 1,
                  }}
                >
                  <Ionicons 
                    name="remove" 
                    size={20} 
                    color={guests.children.length <= 0 ? '#666666' : '#FFFFFF'} 
                  />
                </TouchableOpacity>
                <Text style={{ 
                  color: '#FFFFFF', 
                  fontSize: 18, 
                  fontWeight: 'bold',
                  marginHorizontal: spacing.md,
                  minWidth: 30,
                  textAlign: 'center',
                }}>
                  {guests.children.length}
                </Text>
                <TouchableOpacity
                  onPress={() => handleChildrenChange(guests.children.length + 1)}
                  disabled={!canAddChildren}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: !canAddChildren ? '#666666' : '#FFFFFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: !canAddChildren ? 0.5 : 1,
                  }}
                >
                  <Ionicons name="add" size={20} color={!canAddChildren ? '#666666' : '#FFFFFF'} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Infants */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: '#292929',
            }}>
              <View>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                  infants
                </Text>
                <Text style={{ color: '#A0A0A0', fontSize: 14 }}>
                  under 2
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => handleInfantsChange(guests.infants - 1)}
                  disabled={guests.infants <= 0}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: guests.infants <= 0 ? '#666666' : '#FFFFFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: guests.infants <= 0 ? 0.5 : 1,
                  }}
                >
                  <Ionicons 
                    name="remove" 
                    size={20} 
                    color={guests.infants <= 0 ? '#666666' : '#FFFFFF'} 
                  />
                </TouchableOpacity>
                <Text style={{ 
                  color: '#FFFFFF', 
                  fontSize: 18, 
                  fontWeight: 'bold',
                  marginHorizontal: spacing.md,
                  minWidth: 30,
                  textAlign: 'center',
                }}>
                  {guests.infants}
                </Text>
                <TouchableOpacity
                  onPress={() => handleInfantsChange(guests.infants + 1)}
                  disabled={!canAddInfants}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: !canAddInfants ? '#666666' : '#FFFFFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: !canAddInfants ? 0.5 : 1,
                  }}
                >
                  <Ionicons name="add" size={20} color={!canAddInfants ? '#666666' : '#FFFFFF'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <View style={{ padding: spacing.lg, borderTopWidth: 1, borderTopColor: '#292929' }}>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              style={{
                backgroundColor: '#404040',
                borderRadius: 12,
                paddingVertical: spacing.md,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
} 