import Constants from 'expo-constants'

export class AppConfig {
  static logo = 'https://pbs.twimg.com/profile_images/1904128500480749568/X7LiB3jC_400x400.jpg'
  static name = 'Nomadz'
  static uri = 'https://nomadz.xyz'
  static endpoint = 'https://dev.api.nomadz.xyz/api/v1'
  static privy = {
    appId: Constants.expoConfig?.extra?.privyAppId ?? '',
    clientId: Constants.expoConfig?.extra?.privyClientId ?? '',
  }
}
