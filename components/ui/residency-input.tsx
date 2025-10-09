import { AppText } from '@/components/app-text'
import { COUNTRIES, Country } from '@/constants/countries'
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

const PLACEHOLDER_COUNTRY: Country = {
  code: '',
  name: 'choose your country',
  flag: '🌎',
  phoneCode: '+1',
}

interface ResidencyInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ResidencyInput({ label, value, onChange }: ResidencyInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>(PLACEHOLDER_COUNTRY)
  const [residencies, setResidencies] = useState<Country[]>([...COUNTRIES])
  const [searchValue, setSearchValue] = useState('')

  // Update selectedCountry when value prop changes
  useEffect(() => {
    if (value) {
      const country = COUNTRIES.find(c => c.code === value) || PLACEHOLDER_COUNTRY
      setSelectedCountry(country)
    } else {
      setSelectedCountry(PLACEHOLDER_COUNTRY)
    }
  }, [value])

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    onChange(country.code)
    setIsOpen(false)
    setSearchValue('')
    setResidencies([...COUNTRIES]) // Reset search
  }

  const handleSearch = (text: string) => {
    setSearchValue(text)
    const searchLower = text.toLowerCase()
    
    const filtered = COUNTRIES.filter(country => {
      const countryCode = country.code.toLowerCase()
      const countryName = country.name.toLowerCase()
      
      return countryName.startsWith(searchLower) || 
             countryCode.startsWith(searchLower)
    })
    
    setResidencies(filtered)
  }

  return (
    <View style={{ marginBottom: 16 }}>
      <AppText style={{ color: '#CDCDCD', fontSize: 14, marginBottom: 8 }}>
        {label}
      </AppText>
      
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#1B1B1B',
          borderWidth: 1,
          borderColor: '#2F2F2F',
          borderRadius: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AppText style={{ color: 'white', fontSize: 16 }}>
            {selectedCountry.flag}
          </AppText>
          <AppText style={{ color: 'white', fontSize: 16 }}>
            {selectedCountry.name}
          </AppText>
        </View>
        <AppText style={{ color: '#9CA3AF', fontSize: 12 }}>▼</AppText>
      </TouchableOpacity>

      {/* Country Dropdown */}
      {isOpen && (
        <View style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: '#1C1C1C',
          borderRadius: 8,
          height: 280,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#1C1C1C',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 8,
          }}>
            <AppText style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
                Choose your country
            </AppText>
            <AppText style={{ color: '#9CA3AF', fontSize: 12 }}>▼</AppText>
          </View>

          {/* Country List */}
          <ScrollView 
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {residencies.map((country) => (
              <TouchableOpacity
                key={country.code}
                onPress={() => handleCountrySelect(country)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: selectedCountry.code === country.code ? '#323232' : '#252525',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <AppText style={{ color: 'white', fontSize: 14, flex: 1 }}>
                  {country.name}
                </AppText>
                <AppText style={{ color: 'white', fontSize: 14 }}>
                  {country.flag}
                </AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

ResidencyInput.displayName = 'ResidencyInput'
