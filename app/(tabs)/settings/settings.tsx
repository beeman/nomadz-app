import { AppText } from '@/components/app-text'
import { SettingsAppConfig } from '@/components/settings/settings-app-config'

import { AppPage } from '@/components/app-page'
import { SettingsPrivyConfig } from '@/components/settings/settings-privy-config'

export default function TabSettingsScreen() {
  return (
    <AppPage>
      <SettingsAppConfig />
      <SettingsPrivyConfig />
      <AppText style={{ opacity: 0.5, fontSize: 14 }}>
        Configure app info and clusters in <AppText style={{ fontWeight: 'bold' }}>constants/app-config.tsx</AppText>.
      </AppText>
    </AppPage>
  )
}
