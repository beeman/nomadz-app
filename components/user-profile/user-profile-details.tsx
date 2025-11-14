import { ProfileUiHeader } from '@/components/profile/profile-ui-header';
import { useUserProfile } from '@/components/user-profile/user-profile-provider';
import { getImageUrl } from '@/utils/image.utils';
import { Ionicons } from '@expo/vector-icons';
import { CloverIcon, TrophyIcon } from 'phosphor-react-native';
import React, { useMemo } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { CircleGrayIcon } from '../icons/Icons';

export function UserProfileDetails() {
  const { 
    user,
    isLoading,
    userError,
    communities,
    achievements,
    score,
  } = useUserProfile();

  // Filter achievements by type
  const eventAchievements = useMemo(() => {
    return achievements?.filter(achievement => 
      achievement.achievement?.type === 'Event'
    ) || [];
  }, [achievements]);

  const countryAchievements = useMemo(() => {
    return achievements?.filter(achievement => 
      achievement.achievement?.type === 'Country'
    ) || [];
  }, [achievements]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-xl">Loading...</Text>
      </View>
    );
  }

  if (userError) {
    return (
      <View className="flex-1 justify-center items-center bg-black p-4">
        <Text className="text-red-500 text-center mb-4">
          Error loading user: {userError.message || 'Unknown error'}
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-xl">User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-black flex-1">
      {/* User Header */}
      <View className="p-4">
        <ProfileUiHeader userProfile={user.userProfile} />
      </View>

      {/* Stats Cards */}
      <View className="px-4 mb-6">
        <View className="flex-row gap-3">
          {/* Communities Card */}
          <View className="flex-1 border border-[#323232] rounded-2xl bg-[#121212] p-3">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[#B7B7B7] text-sm">communities</Text>
            </View>
            <View className="flex-row gap-2 py-2">
              {communities && communities.length > 0 ? (
                communities.slice(0, 3).map((community, index) => {
                  const imageUrl = getImageUrl(community.community?.image);
                  return (
                    <View key={index} className="w-7 h-7 rounded-full overflow-hidden bg-gray-400">
                      {imageUrl ? (
                        <Image 
                          source={{ uri: imageUrl }} 
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-full bg-gray-400" />
                      )}
                    </View>
                  );
                })
              ) : (
                <Text className="text-xs text-[#B7B7B7]">no communities yet</Text>
              )}
            </View>
          </View>

          {/* Luck Card */}
          <View className="border border-[#323232] rounded-2xl bg-[#121212] p-3 min-w-[90px] min-h-[90px]">
            <Text className="text-[#B7B7B7] text-sm mb-2">luck</Text>
            <View className="flex-row gap-2 items-center flex-1">
              <CloverIcon weight="fill" color="white" size={22} />
              <Text className="!text-white">{user.userProfile?.luck || 0}</Text>
            </View>
          </View>

          {/* Score Card */}
          <View className="border border-[#323232] rounded-2xl bg-[#121212] p-3 min-w-[90px] min-h-[90px]">
            <Text className="text-[#B7B7B7] text-sm mb-2">score</Text>
            <View className="flex-row gap-2 items-center flex-1">
              <Ionicons name="flash" color="white" size={22} />
              <Text className="text-white">{score || '--'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Achievements Section */}
      <View className="px-4 mb-6">
        <View className="flex-row items-center gap-2 mb-4">
          <TrophyIcon weight="fill" color="#CDCDCD" size={20} />
          <Text className="text-[#CDCDCD] text-lg">achievements</Text>
        </View>
        
        <View className="gap-4">
          {/* Events Achievements */}
          <View className="border border-[#323232] rounded-2xl bg-[#0E0E0E] p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white/60 text-sm">events</Text>
              {eventAchievements.length > 0 && (
                <View className="border border-[#323232] px-3 py-1 bg-[#121212] rounded-2xl">
                  <Text className="text-white text-xs">{eventAchievements.length}</Text>
                </View>
              )}
            </View>
            <View className="flex-row flex-wrap gap-y-4">
              {eventAchievements.length > 0 ? (
                eventAchievements.slice(0, 8).map((achievement, index) => {
                  const badgeUrl = getImageUrl(achievement.achievement?.badge);
                  return (
                    <View key={index} style={{ width: '25%' }} className="items-center">
                      <View className="size-[60px] items-center justify-center">
                        <CircleGrayIcon width={60} height={60} />
                        <View className="absolute size-[43px] rounded-full overflow-hidden">
                          {badgeUrl ? (
                            <Image 
                              source={{ uri: badgeUrl }} 
                              className="size-[43px] rounded-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="size-[43px] rounded-full bg-gray-500" />
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text className="text-white/60 text-center w-full py-4">
                  no event achievements claimed yet
                </Text>
              )}
            </View>
          </View>

          {/* Countries Achievements */}
          <View className="border border-[#323232] rounded-2xl bg-[#0E0E0E] p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white/60 text-sm">countries</Text>
              {countryAchievements.length > 0 && (
                <View className="border border-[#323232] px-3 py-1 bg-[#121212] rounded-2xl">
                  <Text className="text-white text-xs">{countryAchievements.length}</Text>
                </View>
              )}
            </View>
            <View className="flex-row flex-wrap gap-y-4">
              {countryAchievements.length > 0 ? (
                countryAchievements.slice(0, 8).map((achievement, index) => {
                  const badgeUrl = getImageUrl(achievement.achievement?.badge);
                  return (
                    <View key={index} style={{ width: '25%' }} className="items-center">
                      <View className="size-[60px] items-center justify-center">
                        <CircleGrayIcon width={60} height={60} />
                        <View className="absolute size-[43px] rounded-full overflow-hidden">
                          {badgeUrl ? (
                            <Image 
                              source={{ uri: badgeUrl }} 
                              className="size-[43px] rounded-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="size-[43px] rounded-full bg-gray-500" />
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text className="text-white/60 text-center w-full py-4">
                  no country achievements claimed yet
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
