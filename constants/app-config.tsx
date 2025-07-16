import { clusterApiUrl } from '@solana/web3.js'
import { Cluster } from '@/components/cluster/cluster'
import { ClusterNetwork } from '@/components/cluster/cluster-network'
import Constants from 'expo-constants'

export class AppConfig {
  static logo = 'https://pbs.twimg.com/profile_images/1904128500480749568/X7LiB3jC_400x400.jpg'
  static name = 'Nomadz'
  static uri = 'https://nomadz.xyz'
  static clusters: Cluster[] = [
    {
      id: 'solana:devnet',
      name: 'Devnet',
      endpoint: clusterApiUrl('devnet'),
      network: ClusterNetwork.Devnet,
    },
    {
      id: 'solana:testnet',
      name: 'Testnet',
      endpoint: clusterApiUrl('testnet'),
      network: ClusterNetwork.Testnet,
    },
  ]
  static privy = {
    appId: Constants.expoConfig?.extra?.privyAppId ?? '',
    clientId: Constants.expoConfig?.extra?.privyClientId ?? '',
  }
}
