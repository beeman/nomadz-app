import { createContext, type PropsWithChildren, use, useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { PrivyUser, usePrivy } from '@privy-io/expo'
import { useLogin } from '@privy-io/expo/ui'
import { AppConfig } from '@/constants/app-config'

export interface AuthUserProfile {
  name: string
  avatar: string
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<PrivyUser>
  signOut: () => Promise<void>
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

export function AuthProvider({ children }: PropsWithChildren) {
  const { user, logout } = usePrivy()
  const signInMutation = useSignInMutation()

  const value: AuthState = useMemo(() => {
    console.log('useAuth memo', JSON.stringify(user, null, 2))
    return {
      signIn: async () => signInMutation.mutateAsync(),
      signOut: async () => await logout(),
      isAuthenticated: !!user,
      isLoading: signInMutation.isPending,
      user: { name: 'beeman', avatar: require('../../assets/images/beeman-avatar.png') },
    }
  }, [user, signInMutation, logout])

  return <Context value={value}>{children}</Context>
}
