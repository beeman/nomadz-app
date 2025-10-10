import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'phosphor-react-native'
import React from 'react'
import { Alert, TouchableOpacity, View } from 'react-native'
import { Avatar } from './avatar'

interface AvatarUploadProps {
  image: string | null
  onImageChange: (uri: string) => void
  isUploading?: boolean
}

export function AvatarUpload({ image, onImageChange, isUploading = false }: AvatarUploadProps) {
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload photos.')
      return false
    }
    return true
  }

  const handleImagePicker = async () => {
    if (isUploading) return
    
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    })

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri
      onImageChange(imageUri)
    }
  }

  return (
    <TouchableOpacity
      onPress={handleImagePicker}
      style={{
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#1B1B1B',
        borderWidth: 1,
        borderColor: '#2F2F2F',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 16,
      }}
    >
      <Avatar image={image} size={96} />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 32,
          height: 32,
          backgroundColor: 'white',
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Camera size={16} color="#000000" weight="regular" />
      </View>
    </TouchableOpacity>
  )
}

AvatarUpload.displayName = 'AvatarUpload'