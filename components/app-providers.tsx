import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { ClusterProvider } from './cluster/cluster-provider'
import { SolanaProvider } from '@/components/solana/solana-provider'
import { AppThemeProvider } from '@/components/app-theme-provider'
import { AuthProvider } from '@/components/auth/auth-provider'
import { PrivyProvider } from '@privy-io/expo'
import { AppConfig } from '@/constants/app-config'

const queryClient = new QueryClient()

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <PrivyProvider {...AppConfig.privy}>
      <AppThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ClusterProvider>
            <SolanaProvider>
              <AuthProvider>{children}</AuthProvider>
            </SolanaProvider>
          </ClusterProvider>
        </QueryClientProvider>
      </AppThemeProvider>
    </PrivyProvider>
  )
}
