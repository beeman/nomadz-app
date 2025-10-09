import { AppText } from '@/components/app-text'
import { COUNTRIES, Country } from '@/constants/countries'
import React, { useEffect, useState } from 'react'
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native'

const sortCountriesByPhoneCode = (countries: Country[]) => {
  return [...countries].sort((a, b) => {
    // Strip non-numeric characters and compare numerically
    const codeA = parseInt(a.phoneCode.replace(/\D/g, ''), 10)
    const codeB = parseInt(b.phoneCode.replace(/\D/g, ''), 10)
    return codeA - codeB
  })
}

interface PhoneInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function PhoneInput({ label, value, onChange }: PhoneInputProps) {
  const SORTED_COUNTRIES = sortCountriesByPhoneCode(COUNTRIES)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(SORTED_COUNTRIES[0])

  // Validate if the value contains only numbers and '+'
  const isValidPhoneNumber = (val: string) => /^[+\d]*$/.test(val)

  // Find the matching country code from the incoming value
  const findCountryFromValue = (phoneValue: string) => {
    if (!phoneValue || !isValidPhoneNumber(phoneValue)) {
      return SORTED_COUNTRIES[0]
    }
    return SORTED_COUNTRIES.find((country) => phoneValue.startsWith(country.phoneCode)) || SORTED_COUNTRIES[0]
  }

  // Update selectedCountry when value prop changes
  useEffect(() => {
    const newCountry = findCountryFromValue(value)
    setSelectedCountry(newCountry)
  }, [value])

  // Modified value splitting logic to handle incoming value with validation
  const numberValue =
    value && isValidPhoneNumber(value) && value.startsWith(selectedCountry.phoneCode)
      ? value.slice(selectedCountry.phoneCode.length)
      : ''

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setIsOpen(false)
    onChange(`${country.phoneCode}${numberValue}`)
  }

  const MAX_PHONE_LENGTH = 15

  const handleNumberChange = (text: string) => {
    // Only allow numbers
    if (/^\d*$/.test(text)) {
      const trimmed = text.slice(0, MAX_PHONE_LENGTH)
      onChange(`${selectedCountry.phoneCode}${trimmed}`)
    }
  }

  return (
    <View style={{ marginBottom: 16 }}>
      <AppText style={{ color: '#CDCDCD', fontSize: 14, marginBottom: 8 }}>
        {label}
      </AppText>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 12,
            backgroundColor: '#1B1B1B',
            borderWidth: 1,
            borderRightWidth: 0,
            borderColor: '#2F2F2F',
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }}
        >
          <AppText style={{ color: 'white', fontSize: 16 }}>
            {selectedCountry.phoneCode}
          </AppText>
        </TouchableOpacity>
        
        <TextInput
          value={numberValue}
          textContentType='telephoneNumber'
          onChangeText={handleNumberChange}
          placeholder="Phone number"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          maxLength={MAX_PHONE_LENGTH}
          style={{
            flex: 1,
            backgroundColor: '#1B1B1B',
            borderWidth: 1,
            borderColor: '#2F2F2F',
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
            color: 'white',
            fontSize: 16,
          }}
        />
      </View>

      {/* Country Dropdown */}
      {isOpen && (
        <View style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: '#1C1C1C',
          borderWidth: 1,
          borderColor: '#2F2F2F',
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
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
            <AppText style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
              Choose your country code
            </AppText>
            <AppText style={{ color: '#9CA3AF', fontSize: 12 }}>▼</AppText>
          </View>

          {/* Country List */}
          <ScrollView 
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {SORTED_COUNTRIES.map((country) => (
              <TouchableOpacity
                key={`${country.phoneCode}-${country.code}`}
                onPress={() => handleCountrySelect(country)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: selectedCountry.code === country.code ? '#323232' : '#252525',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <AppText style={{ color: 'white', fontSize: 14, marginRight: 12 }}>
                  {country.phoneCode}
                </AppText>
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

PhoneInput.displayName = 'PhoneInput'
