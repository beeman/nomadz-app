import { AppThemeProvider } from '@/components/app-theme-provider'
import { AuthProvider } from '@/components/auth/auth-provider'
import { ClusterProvider } from '@/components/cluster/cluster-provider'
import { ProfileProvider } from '@/components/profile/profile-provider'
import { SolanaProvider } from '@/components/solana/solana-provider'
import { AppConfig } from '@/constants/app-config'
import { ToastProvider } from '@/utils/toastNotifications.utils'
import { PrivyProvider } from '@privy-io/expo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

const queryClient = new QueryClient()

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <PrivyProvider {...AppConfig.privy}>
      <AppThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <ClusterProvider>
              <SolanaProvider>
                <AuthProvider>
                  <ProfileProvider>{children}</ProfileProvider>
                </AuthProvider>
              </SolanaProvider>
            </ClusterProvider>
          </ToastProvider>
        </QueryClientProvider>
      </AppThemeProvider>
    </PrivyProvider>
  )
}
