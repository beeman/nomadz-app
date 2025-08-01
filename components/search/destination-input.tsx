import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { debounce } from '@/utils/debounce'
import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SearchSuggestion, useSearch } from './search-provider'

interface DestinationInputProps {
  value: string
  selectedId?: number
  nameIncludes?: string | null
  onChange: (input: string, id?: number) => void
  onNameSearchChange?: (name: string) => void
  onSuggestionSelect?: () => void
}

export function DestinationInput({ 
  value, 
  selectedId, 
  nameIncludes,
  onChange, 
  onNameSearchChange,
  onSuggestionSelect
}: DestinationInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [suggestionSelected, setSuggestionSelected] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const { searchSuggestions, fetchSearchSuggestions, isSearchSuggestionsLoading, searchParams } = useSearch()
  const spacing = useAppThemeSpacing()

  // Get current destination text
  const getCurrentDestination = () => {
    if (searchParams.selectedDestination) {
      // Show the actual selected destination name
      return searchParams.selectedDestination
    }
    return 'search destination'
  }

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Update suggestions when searchSuggestions changes
  useEffect(() => {
    setSuggestions(searchSuggestions || [])
    setIsLoading(false)
  }, [searchSuggestions])

  // Memoize the debounced function to prevent recreation on every render
  const debouncedFetchSuggestions = useMemo(
    () => debounce(async (searchTerm: string) => {
      if (!searchTerm || searchTerm.trim().length === 0) {
        setSuggestions([])
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        await fetchSearchSuggestions(searchTerm)
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [fetchSearchSuggestions]
  )

  const handleInputChange = useCallback((input: string) => {
    onChange(input)
    debouncedFetchSuggestions(input)
  }, [onChange, debouncedFetchSuggestions])

  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect()
    }
    setSuggestionSelected(true)
    
    if (suggestion.searchEntityType === 'region') {
      // For regions, use the existing location selection logic
      onChange(suggestion.name, suggestion.id as number)
    } else if (suggestion.searchEntityType === 'apartment') {
      // For hotels/apartments, use nameIncludes logic
      onChange(suggestion.name)
      if (onNameSearchChange) {
        onNameSearchChange(suggestion.name)
      }
    }
    setIsOpen(false)
  }, [onSuggestionSelect, onChange, onNameSearchChange])

  const handleContinue = useCallback(() => {
    setIsOpen(false)
  }, [])

  // When dropdown closes and no suggestion was selected, treat input as userIncludes
  useEffect(() => {
    if (!isOpen && !suggestionSelected && value && value.trim() !== '') {
      onNameSearchChange?.(value)
    }
    // Reset for next open
    if (!isOpen) {
      setSuggestionSelected(false)
    }
  }, [isOpen, suggestionSelected, value, onNameSearchChange])

  const getIcon = useCallback((suggestion: SearchSuggestion) => {
    return suggestion.searchEntityType === 'region' 
      ? <Ionicons name="location" size={16} color="#A9A9A9" />
      : <Ionicons name="home" size={16} color="#A9A9A9" />
  }, [])

  const getSubtitle = useCallback((suggestion: SearchSuggestion) => {
    if (suggestion.searchEntityType === 'region') {
      return suggestion.countryName
    } else {
      return suggestion.address || suggestion.category
    }
  }, [])

  const renderSuggestion = useCallback(({ item }: { item: SearchSuggestion }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#444444',
      }}
      onPress={() => handleSuggestionSelect(item)}
    >
      <View style={{ marginRight: spacing.sm }}>
        {getIcon(item)}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '500' }}>
          {item.name}
        </Text>
        <Text style={{ color: '#A0A0A0', fontSize: 12, marginTop: 2 }}>
          {getSubtitle(item)}
        </Text>
      </View>
    </TouchableOpacity>
  ), [spacing.md, spacing.sm, handleSuggestionSelect, getIcon, getSubtitle])

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={{
          backgroundColor: '#1B1B1B',
          borderRadius: 12,
          padding: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: '#292929',
        }}
      >
        <Ionicons name="location" size={20} color="#FFFFFF" style={{ marginRight: spacing.sm }} />
        <Text style={{ color: '#FFFFFF', fontSize: 16, flex: 1 }}>
          {getCurrentDestination()}
        </Text>
      </TouchableOpacity>

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
              Search Destination
            </Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={{ padding: spacing.lg }}>
            <View style={{
              backgroundColor: '#1B1B1B',
              borderRadius: 12,
              padding: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#292929',
            }}>
              <Ionicons name="location" size={20} color="#FFFFFF" style={{ marginRight: spacing.sm }} />
              <TextInput
                ref={inputRef}
                style={{
                  flex: 1,
                  color: '#FFFFFF',
                  fontSize: 16,
                }}
                value={value}
                onChangeText={handleInputChange}
                placeholder="Enter destination..."
                placeholderTextColor="#A0A0A0"
                autoFocus
              />
              {value && (
                <TouchableOpacity
                  onPress={() => {
                    onChange('')
                    if (onNameSearchChange) {
                      onNameSearchChange('')
                    }
                    inputRef.current?.focus()
                  }}
                  style={{
                    padding: spacing.xs,
                    borderRadius: 12,
                  }}
                >
                  <Ionicons name="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Suggestions List */}
          <View style={{ flex: 1, paddingHorizontal: spacing.lg }}>
            {isLoading ? (
              <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
                  Searching...
                </Text>
              </View>
            ) : suggestions.length === 0 && value ? (
              <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <Text style={{ color: '#A0A0A0', fontSize: 14 }}>
                  No locations found
                </Text>
              </View>
            ) : (
              <FlatList
                data={suggestions}
                renderItem={renderSuggestion}
                keyExtractor={(item) => `${item.searchEntityType}-${item.id}`}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
              />
            )}
          </View>

          {/* Continue Button */}
          <View style={{ padding: spacing.lg, borderTopWidth: 1, borderTopColor: '#292929' }}>
            <TouchableOpacity
              onPress={handleContinue}
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