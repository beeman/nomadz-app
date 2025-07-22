import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { AppConfig } from '@/constants/app-config'

export function SettingsPrivyConfig() {
  return (
    <AppView>
      <AppText variant="titleMedium">Privy Config</AppText>
      <AppText>
        appId: <AppText>{AppConfig.privy.appId}</AppText>
      </AppText>
      <AppText>
        clientId: <AppText>{obfuscateClientId(AppConfig.privy.clientId)}</AppText>
      </AppText>
    </AppView>
  )
}

function obfuscateClientId(id: string): string {
  if (id.length <= 8) return id
  return id.slice(0, 11) + '...' + id.slice(-6)
}
