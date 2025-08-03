import { InfoCircleIcon } from '@/components/icons/Icons'
import React, { useEffect, useState } from 'react'
import { Text, TextInput, TextInputProps, View } from 'react-native'

interface InputProps extends TextInputProps {
  label?: string
  labelClassName?: string
  multiline?: boolean
  rows?: number
  prefix?: string
  maxLength?: number
  showCounter?: boolean
  className?: string
}

const Input: React.FC<InputProps> = ({
  label = '',
  multiline = false,
  rows = 4,
  prefix,
  maxLength,
  showCounter = false,
  className = '',
  labelClassName = '',
  value: propValue,
  onChangeText,
  ...props
}) => {
  const [value, setValue] = useState(String(propValue ?? ''))

  useEffect(() => {
    setValue(String(propValue ?? ''))
  }, [propValue])

  const handleChange = (text: string) => {
    let newValue = text
    if (maxLength && text.length > maxLength) {
      newValue = text.slice(0, maxLength)
    }
    setValue(newValue)
    onChangeText?.(newValue)
  }

  const inputStyles = `w-full bg-[#1B1B1B] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white text-base`

  return (
    <View className="gap-y-2.5">
      {label ? <Text className={`text-[#CDCDCD] text-sm ${labelClassName}`}>{label}</Text> : null}

      <View className="relative">
        {prefix && <Text className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10">{prefix}</Text>}

        <TextInput
          {...props}
          multiline={multiline}
          numberOfLines={rows}
          maxLength={maxLength}
          onChangeText={handleChange}
          value={value}
          style={{ paddingTop: multiline ? 12 : 8, paddingBottom: 8 }}
          className={`${inputStyles} ${prefix ? 'pl-10' : ''} ${className}`}
        />

        {maxLength && showCounter ? (
          <Text
            className={`absolute right-2 text-xs select-none ${
              value.length >= maxLength ? 'bottom-3 text-alert-red flex-row items-center' : 'bottom-2 text-[#CDCDCD]'
            }`}
          >
            {value.length >= maxLength ? (
              <>
                <InfoCircleIcon className="mr-1" width={16} height={16} />
                Max {maxLength} characters
              </>
            ) : (
              `${maxLength - value.length}`
            )}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

export default Input
