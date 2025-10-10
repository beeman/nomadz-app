import { useAuth } from '@/components/auth/auth-provider'
import { api } from '@/utils/api'
import { useMutation } from '@tanstack/react-query'
import React, { ReactNode, useCallback, useState } from 'react'

export interface ProfileUpdateData {
  firstName: string
  lastName: string
  username: string
  phone: string
  bio: string
  residency: string
}

export interface ProfileProviderContext {
  updateUser: (data: ProfileUpdateData) => Promise<void>
  isLoading: boolean
  error: string | null
  success: boolean
  clearError: () => void
  clearSuccess: () => void
}

const ProfileContext = React.createContext<ProfileProviderContext>({} as ProfileProviderContext)

export function ProfileProvider(props: { children: ReactNode }) {
  const { children } = props
  const { user } = useAuth()
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

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
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || error.message || 'Failed to update profile')
      setSuccess(false)
    }
  })

  const updateUser = useCallback(async (data: ProfileUpdateData) => {
    await updateUserMutation.mutateAsync(data)
  }, [updateUserMutation])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearSuccess = useCallback(() => {
    setSuccess(false)
  }, [])

  const value: ProfileProviderContext = {
    updateUser,
    isLoading: updateUserMutation.isPending,
    error,
    success,
    clearError,
    clearSuccess
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfileSettings() {
  return React.useContext(ProfileContext)
}
