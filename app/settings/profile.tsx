import { Input } from '@/components/app-input'
import { AppText } from '@/components/app-text'
import { useAuth } from '@/components/auth/auth-provider'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { PhoneInput } from '@/components/ui/phone-input'
import { ResidencyInput } from '@/components/ui/residency-input'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native'

export default function ProfileSettings() {
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    image: null as string | null,
    bio: '',
    residency: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
        image: user.image || null,
        bio: user.bio || '',
        residency: user.residency || '',
      })
    }
  }, [user])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = async (uri: string) => {
    setFormData(prev => ({ ...prev, image: uri }))
    // TODO: Implement actual image upload
  }

  const handleReset = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
        image: user.image || null,
        bio: user.bio || '',
        residency: user.residency || '',
      })
    }
  }

  const handleSubmit = async () => {
    // Validate minimum length requirements
    if (formData.firstName.trim().length < 2) {
      Alert.alert('Error', 'First name must be at least 2 characters long.')
      return
    }

    if (formData.lastName.trim().length < 2) {
      Alert.alert('Error', 'Last name must be at least 2 characters long.')
      return
    }

    if (formData.username.trim().length < 2) {
      Alert.alert('Error', 'Username must be at least 2 characters long.')
      return
    }

    // TODO: Implement actual user update API call
    Alert.alert('Success', 'Profile updated successfully.')
  }

  if (!user) {
    return null
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        {/* Profile Picture */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <AppText style={{ color: '#4C535F', fontSize: 14, marginBottom: 8 }}>
            your profile pic
          </AppText>
          <AvatarUpload image={formData.image} onImageChange={handleImageChange} />
          <AppText style={{ color: 'white', fontSize: 14, textDecorationLine: 'underline' }}>
            choose photo
          </AppText>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: '#E0E4EC1a', borderRadius: 1, marginBottom: 24 }} />

        {/* Form Fields */}
        <View style={{ gap: 16 }}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Input
                label="first name"
                value={formData.firstName}
                onChangeText={(value) => handleChange('firstName', value)}
                maxLength={50}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="last name"
                value={formData.lastName}
                onChangeText={(value) => handleChange('lastName', value)}
                maxLength={50}
              />
            </View>
          </View>

          <Input
            label="email"
            value={formData.email}
            onChangeText={() => {}} // Disabled
            disabled
            keyboardType="email-address"
          />

          <Input
            label="username"
            value={formData.username}
            onChangeText={(value) => handleChange('username', value)}
            maxLength={32}
          />

          <PhoneInput
            label="phone number"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
          />

          <ResidencyInput
            label="residency"
            value={formData.residency}
            onChange={(value) => handleChange('residency', value)}
          />

          <Input
            label="bio"
            value={formData.bio}
            onChangeText={(value) => handleChange('bio', value)}
            multiline
            numberOfLines={4}
            maxLength={140}
            placeholder="Tell us about yourself..."
          />
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 32 }}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 25,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <AppText style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>
              save
            </AppText>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleReset}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 12,
            }}
          >
            <AppText style={{ color: '#999999', fontSize: 16 }}>
              reset
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
