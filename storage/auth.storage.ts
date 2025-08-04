import { HttpStatusCode } from 'axios'
import { atom } from 'jotai'
import { NOTIFICATION_MESSAGES } from '../constants/notifications.constants'
import { ActionCreatorOptions } from '../types/action.types'
import { User, UserBillingProfile, UserProfile } from '../types/user.types'
import { api } from '../utils/api'
import { resolveUrl } from '../utils/app.utils'

// Base atom for authenticated user
export const authenticatedUserAtom = atom<
  (User & { userProfile: UserProfile; userBillingProfile: UserBillingProfile }) | null
>(null)

export const authErrorsAtom = atom({
  fetchAuthenticatedUser: null,
  login: null,
  register: null,
  refresh: null,
  logout: null,
})

// Fetch authenticated user atom that handles both reading and writing
export const fetchAuthenticatedUserAtom = atom(
  // Read
  (get) => get(authenticatedUserAtom),
  // Write
  async (get, set, options?: ActionCreatorOptions) => {
    set(authErrorsAtom, { ...get(authErrorsAtom), fetchAuthenticatedUser: null })

    try {
      // First API call to get auth user
      const authResponse = await api.get('auth/user')

      if (authResponse.status === HttpStatusCode.Ok) {
        // Get the userProfileId from the first response
        const { id } = authResponse.data

        if (!id) {
          console.error('No userProfileId found in auth response')
          return
        }

        // Second API call to get detailed user profile
        const profileResponse = await api.get(
          resolveUrl(`users/${id}`, {
            include: {
              userProfile: true,
              userBillingProfile: true,
              suitcases: true,
            },
          }),
        )

        if (profileResponse.status === HttpStatusCode.Ok) {
          // Combine the data if needed, or just use the profile data
          const userData = {
            ...authResponse.data,
            userProfile: profileResponse.data.userProfile,
            userBillingProfile: profileResponse.data.userBillingProfile,
          }

          options?.onSuccess?.(userData)
          set(authenticatedUserAtom, userData)
          return userData
        }
      }
    } catch (error: any) {
      options?.onError?.(error)
      set(authErrorsAtom, {
        ...get(authErrorsAtom),
        fetchAuthenticatedUser: 'Cannot fetch authenticated user',
      })
    }
  },
)

export const loginPrivyAtom = atom(null, async (get, set, privyAccessToken: string, options?: ActionCreatorOptions) => {
  set(authErrorsAtom, { ...get(authErrorsAtom), login: null })
  set(readyAtom, false)

  try {
    const response = await api.post('auth/login/privy', { privyAccessToken })

    if (response.status === HttpStatusCode.Created) {
      // Fetch user profile and billing profile
      const { id } = response.data
      const profileResponse = await api.get(`users/${id}?include.userProfile&include.userBillingProfile`)

      if (profileResponse.status === HttpStatusCode.Ok) {
        const userData = {
          ...response.data,
          userProfile: profileResponse.data.userProfile,
          userBillingProfile: profileResponse.data.userBillingProfile,
        }

        set(authenticatedUserAtom, userData)
        options?.onSuccess?.(userData)
        console.log('login/privy response', userData)
      }
    }
  } catch (error: any) {
    options?.onError?.(error)
    set(authErrorsAtom, { ...get(authErrorsAtom), login: error?.response?.data })
  } finally {
    set(readyAtom, true)
  }
})

export const registerPrivyAtom = atom(
  null,
  async (get, set, privyAccessToken: string, referralCode?: string | null, options?: ActionCreatorOptions) => {
    set(authErrorsAtom, { ...get(authErrorsAtom), register: null })

    try {
      const response = await api.post('auth/register/privy', { privyAccessToken, referralCode })

      if (response.status === HttpStatusCode.Created) {
        // Fetch user profile and billing profile
        const { id } = response.data
        const profileResponse = await api.get(`users/${id}?include.userProfile&include.userBillingProfile`)

        if (profileResponse.status === HttpStatusCode.Ok) {
          const userData = {
            ...response.data,
            userProfile: profileResponse.data.userProfile,
            userBillingProfile: profileResponse.data.userBillingProfile,
          }

          set(authenticatedUserAtom, userData)
          options?.onSuccess?.(userData)
        }

        // Create welcome notification
        await api.post(`users/${response.data.id}/notifications`, {
          content: NOTIFICATION_MESSAGES.WELCOME,
        })
      }
    } catch (error: any) {
      options?.onError?.(error)
      set(authErrorsAtom, { ...get(authErrorsAtom), register: error?.response?.data })
      console.log('register/privy error:', error.message)
    }
  },
)

export const logoutAtom = atom(null, async (get, set, options?: ActionCreatorOptions) => {
  set(authErrorsAtom, { ...get(authErrorsAtom), logout: null })

  try {
    const response = await api.post('auth/logout')

    if ([HttpStatusCode.Ok, HttpStatusCode.Created].includes(response.status)) {
      set(authenticatedUserAtom, null) // Clear the user data
      options?.onSuccess?.(response.data)
    }
  } catch (error: any) {
    options?.onError?.(error)
    set(authErrorsAtom, { ...get(authErrorsAtom), logout: error?.response?.data })
  }
})

export const readyAtom = atom<boolean>(true)

export const registerWithCredentialsAtom = atom(
  null,
  async (get, set, credentials: { email: string; password: string }, options?: ActionCreatorOptions) => {
    set(authErrorsAtom, { ...get(authErrorsAtom), register: null })

    try {
      const response = await api.post('auth/register/credentials', credentials)

      if (response.status === HttpStatusCode.Created) {
        // Fetch user profile and billing profile
        const { id } = response.data
        const profileResponse = await api.get(`users/${id}?include.userProfile&include.userBillingProfile`)

        if (profileResponse.status === HttpStatusCode.Ok) {
          const userData = {
            ...response.data,
            userProfile: profileResponse.data.userProfile,
            userBillingProfile: profileResponse.data.userBillingProfile,
          }

          set(authenticatedUserAtom, userData)
          options?.onSuccess?.(userData)
        }

        // Create welcome notification
        await api.post(`users/${response.data.id}/notifications`, {
          content: NOTIFICATION_MESSAGES.WELCOME,
        })
      }
    } catch (error: any) {
      options?.onError?.(error)
      set(authErrorsAtom, { ...get(authErrorsAtom), register: error?.response?.data })
    }
  },
)

export const loginWithCredentialsAtom = atom(
  null,
  async (get, set, credentials: { email: string; password: string }, options?: ActionCreatorOptions) => {
    set(authErrorsAtom, { ...get(authErrorsAtom), login: null })
    set(readyAtom, false)

    try {
      const response = await api.post('auth/login/credentials', credentials)

      if (response.status === HttpStatusCode.Created) {
        // Fetch user profile and billing profile
        const { id } = response.data
        const profileResponse = await api.get(`users/${id}?include.userProfile&include.userBillingProfile`)

        if (profileResponse.status === HttpStatusCode.Ok) {
          const userData = {
            ...response.data,
            userProfile: profileResponse.data.userProfile,
            userBillingProfile: profileResponse.data.userBillingProfile,
          }

          set(authenticatedUserAtom, userData)
          options?.onSuccess?.(userData)
        }
      }
    } catch (error: any) {
      options?.onError?.(error)
      set(authErrorsAtom, { ...get(authErrorsAtom), login: error?.response?.data })
    } finally {
      set(readyAtom, true)
    }
  },
)
