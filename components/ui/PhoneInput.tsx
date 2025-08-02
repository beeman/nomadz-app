import React, { useEffect, useState } from 'react'
import { COUNTRIES, Country } from '../../constants/countries'
import { ChevronDownIcon } from '../icons/Icons'
import Dropdown from './Dropdown'

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
  className?: string
}

const PhoneInput: React.FC<PhoneInputProps> = ({ label, value, onChange, className = '' }) => {
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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value
    // Only allow numbers
    if (isValidPhoneNumber(newNumber)) {
      const trimmed = newNumber.slice(0, MAX_PHONE_LENGTH)
      onChange(`${selectedCountry.phoneCode}${trimmed}`)
    }
  }

  const handleNumberPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text')
    const allowed = MAX_PHONE_LENGTH - numberValue.length
    if (paste.length > allowed) {
      e.preventDefault()
      const toPaste = paste.slice(0, allowed)
      onChange(`${selectedCountry.phoneCode}${numberValue + toPaste}`)
    }
  }

  return (
    <View className={`gap-y-2.5 ${className}`}>
      <label className="block text-[#CDCDCD] text-[13.41px]/[15.07px] text-normal">{label}</label>
      <View className="flex relative">
        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-3 text-white bg-[#1B1B1B] border-[0.8px] border-[#2F2F2F] rounded-l-lg hover:border-white/60"
        >
          <Text>{selectedCountry.phoneCode}</Text>
        </Button>
        <input
          type="tel"
          value={numberValue}
          onChange={handleNumberChange}
          onPaste={handleNumberPaste}
          maxLength={MAX_PHONE_LENGTH}
          className="w-full px-4 py-2 text-white bg-[#1B1B1B] border-[0.8px] border-[#2F2F2F] rounded-r-lg focus:outline-none focus:border-white/60"
        />

        <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <View className="absolute z-50 w-[260px] max-h-[280px] overflow-y-auto bg-[#303030] border border-[#2F2F2F] rounded-lg shadow-lg">
            <View className="p-2">
              <View className="flex justify-between items-center text-xs px-3 py-2 font-medium text-white bg-[#303030] border-b border-[#2F2F2F]">
                <Text>Choose your country code</Text>
                <ChevronDownIcon />
              </View>
              {SORTED_COUNTRIES.map((country) => (
                <Button
                  key={country.phoneCode}
                  onClick={() => handleCountrySelect(country)}
                  className="flex items-center w-full gap-2 px-3 py-1 text-white rounded-md hover:bg-[#3D3D3D]"
                >
                  <Text className="text-xs">{country.phoneCode}</Text>
                  <Text className="text-xs">{country.name}</Text>
                  <Text className="ml-auto">{country.flag}</Text>
                </Button>
              ))}
            </View>
          </View>
        </Dropdown>
      </View>
    </View>
  )
}

export default PhoneInput
