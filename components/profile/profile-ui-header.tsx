import { AppText } from '@/components/app-text'
import { useAuth } from '@/components/auth/auth-provider'
import { LevelIcon, XIcon, XPIcon } from '@/components/icons/Icons'
import { Avatar } from '@/components/ui/avatar'
import { getUserLevel, levels } from '@/utils/level.utils'
import { LinearGradient } from 'expo-linear-gradient'
import * as React from 'react'
import { View } from 'react-native'

export function ProfileUiHeader() {
  const { user } = useAuth()
  if (!user) {
    return null
  }

  const userExperience = Math.ceil(Number(user.experience || 0))
  const userLevel = getUserLevel(userExperience)

  const nextLevelIndex = levels.findIndex(level => level.experienceThreshold > userExperience)
  const nextLevel = levels[nextLevelIndex] || levels[levels.length - 1]
  const progressPercentage = userLevel.number >= levels[levels.length - 1].number ? 100 : 
    ((userExperience - userLevel.experienceThreshold) /
      (nextLevel.experienceThreshold - userLevel.experienceThreshold)) *
    100

  return (
    <View className="relative rounded-[22px] border border-[#323232] p-6 min-h-[100px] bg-black">
      {/* Top center X icon */}
      <View className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <XIcon className="!size-4" color="white" />
      </View>

      {/* Main content */}
      <View className="">
        {/* Avatar and Username */}
        <View className="flex-row items-center gap-4 mb-4">
          {/* Avatar */}
          <View className="flex-shrink-0">
            <Avatar image={user?.image} size={64} />
          </View>

          {/* Username */}
          <View className="flex-1">
            <AppText className="text-lg font-medium !text-[#E9E9E9]">
              {user?.username}
            </AppText>
          </View>
        </View>

        {/* Level, XP and Progress Bar */}
        <View className="gap-2">
          {/* Level and XP */}
          <View className="flex-row justify-between items-end gap-4">
            <View className="flex-row items-end gap-1">
              <AppText className="text-[28px]/[28px] -mb-1 font-semibold !text-white bg-gradient-to-br from-white via-white to-[#999999] bg-clip-text">
                {userLevel.number}
              </AppText>
              <LevelIcon color="rgba(255,255,255,0.9)" width={21} className="mb-0.5" />
            </View>
            <View className="flex-row items-center gap-0.5">
              <AppText className="text-sm !text-white bg-gradient-to-br from-white via-white to-[#999999] bg-clip-text">
                {userExperience}/{nextLevel.experienceThreshold}
              </AppText>
              <XPIcon color="#FFFFFF" width={18} height={9} />
            </View>
          </View>

          {/* Progress bar */}
          <View className="mt-1">
            <View className="h-[15px] bg-gray-600 rounded-full overflow-hidden">
              <LinearGradient
                colors={['#00A965', '#00D0DA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ 
                  height: '100%',
                  borderRadius: 7.5,
                  width: `${progressPercentage > 3 ? progressPercentage : 3}%`
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
