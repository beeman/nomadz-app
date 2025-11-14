import { AppText } from '@/components/app-text'
import { useAuth } from '@/components/auth/auth-provider'
import { ProfileUiHeader } from '@/components/profile/profile-ui-header'
import { useRouter } from 'expo-router'
import {
  BookmarkSimple,
  CaretRight,
  ChatCircle,
  Gear,
  Question,
  SignOut
} from 'phosphor-react-native'
import * as React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

interface MenuItemProps {
  icon: React.ReactNode
  title: string
  onPress?: () => void
  isDestructive?: boolean
  className?: string;
}

function MenuItem({ icon, title, onPress, isDestructive = false, className = '' }: MenuItemProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center justify-between py-4 px-4 ${className}`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center gap-4">
        {icon}
        <AppText className={`text-base font-medium ${isDestructive ? '!text-[#FF5858]' : '!text-white'}`}>
          {title}
        </AppText>
      </View>
      {!isDestructive && (
        <CaretRight size={16} color="white" weight="regular" />
      )}
    </TouchableOpacity>
  )
}

export function ProfileFeature() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  
  if (!user) {
    return null
  }

  const handleProfilePress = () => {
    router.navigate(`/user/${user.userId}`)
  }

  return (
    <ScrollView className="bg-black p-4 h-full">
      <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
        <ProfileUiHeader userProfile={user} />
      </TouchableOpacity>
      <View className='flex flex-col items-stretch pt-8'>
        {/* Menu Items */}
        <MenuItem
          icon={<Gear size={24} color="white" weight="regular" />}
          title="profile settings"
          onPress={() => console.log('Profile settings')}
        />
        
        <MenuItem
          icon={<BookmarkSimple size={24} color="white" weight="regular" />}
          title="saved trips"
          onPress={() => console.log('Saved trips')}
        />
        
        <MenuItem
          icon={<ChatCircle size={24} color="white" weight="regular" />}
          title="messages"
          onPress={() => console.log('Messages')}
        />
        
        <MenuItem
          icon={<Question size={24} color="white" weight="regular" />}
          title="hints"
          onPress={() => console.log('Hints')}
        />
      </View>

      <View
        className='mt-auto flex-1'
      >
        <MenuItem
          icon={<SignOut size={24} color="#ef4444" weight="regular" />}
          title="sign out"
          onPress={signOut}
          isDestructive={true}
          />
      </View>
    </ScrollView>
  )
}
