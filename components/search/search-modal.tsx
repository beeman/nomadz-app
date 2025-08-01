import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { DestinationInput } from './destination-input'
import { useSearch } from './search-provider'

const SORT_OPTIONS = [
  { key: 'most_relevant', label: 'most relevant' },
  { key: 'price_lowest', label: 'price (lowest first)' },
  { key: 'price_highest', label: 'price (highest first)' },
  { key: 'distance', label: 'distance from city centre' },
  { key: 'best_reviews', label: 'best reviews' },
]

const PROPERTY_TYPES = [
  'all', 'villas and bungalows', 'sanatorium', 'resort', 'mini-hotel',
  'hotel', 'hostel', 'guesthouse', 'glamping', 'farm', 'cottages and houses',
  'castle', 'camping', 'boutique and design', 'bnb', 'apartment', 'apart-hotel'
]

export function SearchModal() {
  const {
    isSearchModalOpen,
    closeSearchModal,
    filters,
    updateFilters,
    searchParams,
    updateSearchParams,
    performSearch,
  } = useSearch()
  
  const spacing = useAppThemeSpacing()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [destinationValue, setDestinationValue] = useState('')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const togglePropertyType = (type: string) => {
    if (type === 'all') {
      updateFilters({ categories: [] })
    } else {
      const newCategories = filters.categories.includes(type)
        ? filters.categories.filter(c => c !== type)
        : [...filters.categories, type]
      updateFilters({ categories: newCategories })
    }
  }

  const isPropertyTypeSelected = (type: string) => {
    if (type === 'all') {
      return filters.categories.length === 0
    }
    return filters.categories.includes(type)
  }

  const handleDestinationChange = (input: string, id?: number) => {
    setDestinationValue(input)
    if (id) {
      // Region selected - clear nameIncludes and set regionId
      updateSearchParams({ 
        regionId: id, 
        nameIncludes: undefined,
        selectedDestination: input // Store the region name
      })
    } else {
      // Hotel or custom input - clear regionId and set nameIncludes
      updateSearchParams({ 
        regionId: undefined, 
        nameIncludes: input,
        selectedDestination: input // Store the hotel name or custom input
      })
    }
  }

  const handleNameSearchChange = (name: string) => {
    // Only set nameIncludes if no regionId is selected
    if (!searchParams.regionId) {
      updateSearchParams({ 
        nameIncludes: name,
        selectedDestination: name // Store the custom input
      })
    }
  }

  return (
    <Modal
      visible={isSearchModalOpen}
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
            what&apos;s your destination?
          </Text>
          <TouchableOpacity onPress={closeSearchModal}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: spacing.lg }}>
          {/* Destination Search */}
          <DestinationInput
            value={destinationValue}
            onChange={handleDestinationChange}
            onNameSearchChange={handleNameSearchChange}
          />

          {/* Check-in/Check-out */}
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: '#1B1B1B',
              borderRadius: 12,
              padding: spacing.md,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#292929',
            }}>
              <Ionicons name="calendar" size={20} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 14, marginTop: spacing.xs }}>
                check in
              </Text>
              <Text style={{ color: '#A0A0A0', fontSize: 12 }}>
                add date
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: '#1B1B1B',
              borderRadius: 12,
              padding: spacing.md,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#292929',
            }}>
              <Ionicons name="calendar" size={20} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 14, marginTop: spacing.xs }}>
                check out
              </Text>
              <Text style={{ color: '#A0A0A0', fontSize: 12 }}>
                add date
              </Text>
            </TouchableOpacity>
          </View>

          {/* Guests */}
          <TouchableOpacity style={{
            backgroundColor: '#1B1B1B',
            borderRadius: 12,
            padding: spacing.md,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: '#292929',
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
              guests: {searchParams.guests.adults}
            </Text>
          </TouchableOpacity>

          {/* Property Type */}
          <View style={{ marginBottom: spacing.md }}>
            <TouchableOpacity
              onPress={() => toggleSection('propertyType')}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.sm,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                property type
              </Text>
              <Ionicons 
                name={expandedSection === 'propertyType' ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            {expandedSection === 'propertyType' && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
                {PROPERTY_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => togglePropertyType(type)}
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.xs,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#FFFFFF80',
                      backgroundColor: isPropertyTypeSelected(type) ? '#FFFFFF1F' : '#1B1B1B',
                      marginBottom: spacing.xs,
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Price Range */}
          <View style={{ marginBottom: spacing.md }}>
            <TouchableOpacity
              onPress={() => toggleSection('priceRange')}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.sm,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                price range
              </Text>
              <Ionicons 
                name={expandedSection === 'priceRange' ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            {expandedSection === 'priceRange' && (
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 12, marginBottom: spacing.xs }}>
                    min
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: '#1B1B1B',
                      borderRadius: 8,
                      padding: spacing.sm,
                      color: '#FFFFFF',
                      borderWidth: 1,
                      borderColor: '#FFFFFF',
                      fontSize: 14,
                    }}
                    value={filters.minPrice.toString()}
                    onChangeText={(text) => updateFilters({ minPrice: parseInt(text) || 0 })}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 12, marginBottom: spacing.xs }}>
                    max
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: '#1B1B1B',
                      borderRadius: 8,
                      padding: spacing.sm,
                      color: '#FFFFFF',
                      borderWidth: 1,
                      borderColor: '#FFFFFF',
                      fontSize: 14,
                    }}
                    value={filters.maxPrice.toString()}
                    onChangeText={(text) => updateFilters({ maxPrice: parseInt(text) || 0 })}
                    keyboardType="numeric"
                    placeholder="350+"
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>
            )}
          </View>

          {/* Sort By */}
          <View style={{ marginBottom: spacing.md }}>
            <TouchableOpacity
              onPress={() => toggleSection('sortBy')}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.sm,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                sort by
              </Text>
              <Ionicons 
                name={expandedSection === 'sortBy' ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            {expandedSection === 'sortBy' && (
              <View style={{ backgroundColor: '#1B1B1B', borderRadius: 8, overflow: 'hidden' }}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => updateFilters({ sort: option.key as any })}
                    style={{
                      paddingVertical: spacing.sm,
                      backgroundColor: filters.sort === option.key ? '#292929' : 'transparent',
                      paddingHorizontal: spacing.md,
                      borderBottomWidth: filters.sort === option.key ? 0 : 1,
                      borderBottomColor: '#292929',
                    }}
                  >
                    <Text style={{ 
                      color: filters.sort === option.key ? '#FFFFFF' : '#A9A9A9',
                      fontSize: 14,
                    }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Free Cancellation */}
          <View style={{ marginBottom: spacing.md }}>
            <TouchableOpacity
              onPress={() => toggleSection('freeCancellation')}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.sm,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                free cancellation
              </Text>
              <Ionicons 
                name={expandedSection === 'freeCancellation' ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            {expandedSection === 'freeCancellation' && (
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: '#1B1B1B',
                padding: spacing.md,
                borderRadius: 8,
              }}>
                <Text style={{ color: '#A0A0A0', fontSize: 14, flex: 1 }}>
                  Show only properties with free cancellation
                </Text>
                <Switch
                  value={filters.hasFreeCancellation}
                  onValueChange={(value) => updateFilters({ hasFreeCancellation: value })}
                  trackColor={{ false: '#292929', true: '#FFFFFF' }}
                  thumbColor={filters.hasFreeCancellation ? '#000000' : '#FFFFFF'}
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={{ padding: spacing.lg, borderTopWidth: 1, borderTopColor: '#292929' }}>
          <TouchableOpacity
            onPress={performSearch}
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
  )
} 