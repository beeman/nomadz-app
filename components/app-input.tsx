import { AppText } from '@/components/app-text'
import React from 'react'
import { TextInput, View } from 'react-native'

interface InputProps {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  multiline?: boolean
  numberOfLines?: number
  maxLength?: number
  disabled?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
}

export function Input({
  label = '',
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  disabled = false,
  keyboardType = 'default',
}: InputProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      {!!label && (
        <AppText style={{ color: '#CDCDCD', fontSize: 14, marginBottom: 8 }}>
          {label}
        </AppText>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        editable={!disabled}
        keyboardType={keyboardType}
        style={{
          backgroundColor: '#1B1B1B',
          borderWidth: 1,
          borderColor: '#2F2F2F',
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          color: 'white',
          fontSize: 16,
          opacity: disabled ? 0.6 : 1,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  )
}

Input.displayName = 'Input'