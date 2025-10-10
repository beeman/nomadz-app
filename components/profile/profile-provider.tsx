import { useAuth } from '@/components/auth/auth-provider'
import { api } from '@/utils/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { ReactNode, useCallback, useState } from 'react'

export interface ProfileUpdateData {
  firstName: string
  lastName: string
  username: string
  phone: string
  bio: string
  residency: string
  image?: string | null
}

export interface ProfileProviderContext {
  updateUser: (data: ProfileUpdateData) => Promise<void>
  uploadImage: (imageUri: string) => Promise<void>
  isLoading: boolean
  isImageUploading: boolean
  error: string | null
  success: boolean
  clearError: () => void
  clearSuccess: () => void
  localImageUri: string | null
  setLocalImageUri: (uri: string | null) => void
}

const ProfileContext = React.createContext<ProfileProviderContext>({} as ProfileProviderContext)

export function ProfileProvider(props: { children: ReactNode }) {
  const { children } = props
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [localImageUri, setLocalImageUri] = useState<string | null>(null)

  const updateUserMutation = useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      if (!user?.userId) {
        throw new Error('User not authenticated')
      }

      // Create FormData for the API request
      const formData = new FormData()
      
      // Add userProfile fields
      formData.append('userProfile[firstName]', data.firstName)
      formData.append('userProfile[lastName]', data.lastName)
      formData.append('userProfile[username]', data.username)
      formData.append('userProfile[phone]', data.phone)
      formData.append('userProfile[bio]', data.bio)
      formData.append('userProfile[residency]', data.residency)

      const response = await api.putForm(`users/${user.userId}`, formData)
      return response.data
    },
    onSuccess: () => {
      setSuccess(true)
      setError(null)
      // Invalidate only the user data query, not the login query
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'get-user'
      })
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || error.message || 'Failed to update profile')
      setSuccess(false)
    }
  })

  const uploadImageMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      if (!user?.userId) {
        throw new Error('User not authenticated')
      }

      const formData = new FormData()
      formData.append('userProfile[image]', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile-image.jpg',
      } as any)

      const response = await api.putForm(`users/${user.userId}`, formData)
      return response.data
    },
    onSuccess: () => {
      setSuccess(true)
      setError(null)
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || error.message || 'Failed to upload image')
      setSuccess(false)
    }
  })

  const updateUser = useCallback(async (data: ProfileUpdateData) => {
    await updateUserMutation.mutateAsync(data)
  }, [updateUserMutation])

  const uploadImage = useCallback(async (imageUri: string) => {
    await uploadImageMutation.mutateAsync(imageUri)
  }, [uploadImageMutation])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearSuccess = useCallback(() => {
    setSuccess(false)
  }, [])

  const value: ProfileProviderContext = {
    updateUser,
    uploadImage,
    isLoading: updateUserMutation.isPending,
    isImageUploading: uploadImageMutation.isPending,
    error,
    success,
    clearError,
    clearSuccess,
    localImageUri,
    setLocalImageUri
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfileSettings() {
  return React.useContext(ProfileContext)
}
