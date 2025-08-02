import { useAuth } from '@/components/auth/auth-provider'
import { ArrowLeftIcon } from '@/components/icons/Icons'
import ShareButton from '@/components/property/ShareButton'
import SaveApartmentButton from '@/components/ui/SaveApartmentButton'
import { ApartmentInfo } from '@/types/booking.types'
import { Link } from 'expo-router'
import { View } from 'react-native'

interface MobileHeaderProps {
  property: ApartmentInfo
}

export default function MobileHeader({ property }: MobileHeaderProps) {
  const { user } = useAuth()

  return (
    <View className="absolute top-0 left-0 right-0 z-10 flex flex-row items-center justify-between w-full p-2 text-[#D9D9D9]">
      <Link href={'/'} className="p-2 transition-colors rounded-full bg-[#323232]/50">
        <ArrowLeftIcon width={20} height={20} color="#D9D9D9" />
      </Link>

      <View className="flex flex-row items-center gap-2">
        <View>
          <SaveApartmentButton
            hid={property.hid}
            isAuthenticated={!!user}
            events={[]}
            onToggleSave={async () => {}}
            isLoading={false}
            className="!static p-2 transition-colors rounded-full !bg-[#323232]/50 size-9"
          />
        </View>
        <View>
          <ShareButton
            className="p-2 transition-colors rounded-full bg-[#323232]/50 size-9"
            url={`https://nomadz.xyz/property/${property.hid}`}
          />
        </View>
      </View>
    </View>
  )
}
