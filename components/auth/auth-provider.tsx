import { Account } from '@/components/solana/use-authorization'
import { useMobileWallet } from '@/components/solana/use-mobile-wallet'
import { AppConfig } from '@/constants/app-config'
import { api } from '@/utils/api'
import { PrivyUser, usePrivy } from '@privy-io/expo'
import { useLogin } from '@privy-io/expo/ui'
import { useMutation, useQuery } from '@tanstack/react-query'
import { HttpStatusCode } from 'axios'
import { createContext, type PropsWithChildren, use, useMemo } from 'react'

export interface AuthUserProfile {
  id: string
  userId: string
  username: string
  email: string
  firstName: string
  lastName: string
  residency: string
  bio?: string
  phone: string
  experience?: number
  luck?: number
  image?: string
  twitterUsername: null
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<PrivyUser>
  signOut: () => Promise<void>
  connectWallet: () => Promise<Account>
  disconnectWallet: () => Promise<void>
  user?: AuthUserProfile
}

const Context = createContext<AuthState>({} as AuthState)

export function useAuth() {
  const value = use(Context)
  if (!value) {
    throw new Error('useAuth must be wrapped in a <AuthProvider />')
  }

  return value
}

function useSignInMutation() {
  const { login } = useLogin()

  return useMutation({
    mutationFn: async () =>
      await login({
        loginMethods: ['email', 'google', 'twitter'],
        appearance: { logo: AppConfig.logo },
      })
        .then((session) => session.user)
        .catch((err) => {
          console.log(JSON.stringify(err.error) as string)
          throw err
        }),
  })
}

function useSignInWithWalletMutation() {
  const { connect } = useMobileWallet()

  return useMutation({
    mutationFn: async () => await connect(),
  })
}

function useGetUserQuery() {
  const { getAccessToken, user } = usePrivy()
  return useQuery({
    queryKey: ['get-user', user],
    queryFn: () =>
      getAccessToken()
        .then(async (privyAccessToken) => await api.post('auth/login/privy', { privyAccessToken }))
        .then(async (response) => {
          if (response.status === HttpStatusCode.Created) {
            // Fetch user profile and billing profile
            const { id } = response.data
            const profileResponse = await api.get(`users/${id}?include.userProfile&include.userBillingProfile`)

            if (profileResponse.status === HttpStatusCode.Ok) {
              const profile = profileResponse.data.userProfile as AuthUserProfile
              const image = profile.image
                ? `${AppConfig.imageBase}${profile.image}`
                : require('@/assets/svgs/default-avatar.svg')

              return {
                ...profile,
                userId: response.data.id,
                image,
              } as AuthUserProfile
            }
            throw new Error(`Profile Status !== Ok`)
          }
          throw new Error(`Response Status !== Created`)
        }),
  })
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { isReady, user, logout } = usePrivy()
  const { disconnect } = useMobileWallet()
  const signInWithWalletMutation = useSignInWithWalletMutation()
  const signInMutation = useSignInMutation()
  const getUserQuery = useGetUserQuery()

  const value: AuthState = useMemo(() => {
    return {
      signIn: async () => signInMutation.mutateAsync(),
      connectWallet: async () => signInWithWalletMutation.mutateAsync(),
      signOut: async () => await logout(),
      disconnectWallet: async () => await disconnect(),
      isAuthenticated: !!user,
      isLoading: !isReady || signInMutation.isPending,
      user: getUserQuery.data,
    }
  }, [user, isReady, signInMutation, signInWithWalletMutation, getUserQuery.data, disconnect, logout])

  return <Context value={value}>{children}</Context>
}
