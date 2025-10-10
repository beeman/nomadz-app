import { useProfileSettings } from '@/components/profile/profile-provider'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Image } from 'expo-image'
import React from 'react'
import { View } from 'react-native'

interface AvatarProps {
  image: string | null
  size?: number
  style?: any
}

export function Avatar({ image, size = 64, style }: AvatarProps) {
  const { localImageUri } = useProfileSettings()
  
  // Use local image if available, otherwise use the provided image
  const displayImage = localImageUri || image
  const isRemoteImage = displayImage && displayImage.startsWith('http')
  const isLocalImage = displayImage && !displayImage.startsWith('http')

  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2 }, style]}>
      {isRemoteImage ? (
        <Image 
          style={{ 
            height: size, 
            width: size, 
            borderRadius: size / 2 
          }} 
          source={{ uri: displayImage }} 
        />
      ) : isLocalImage ? (
        <Image 
          style={{ 
            height: size, 
            width: size, 
            borderRadius: size / 2 
          }} 
          source={{ uri: displayImage }} 
        />
      ) : (
        <UiIconSymbol size={size} name="person.wave.2.fill" color="#E9E9E9" />
      )}
    </View>
  )
}

Avatar.displayName = 'Avatar'
