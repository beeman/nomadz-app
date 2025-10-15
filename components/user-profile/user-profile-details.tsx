import { AppText } from '@/components/app-text';
import { ProfileUiHeader } from '@/components/profile/profile-ui-header';
import { useUserProfile } from '@/components/user-profile/user-profile-provider';
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';

export function UserProfileDetails() {
  const { 
    user,
    isLoading,
    userError,
    communities,
    achievements,
  } = useUserProfile();

  // Log communities and achievements when data is loaded
  useEffect(() => {
    if (!isLoading && communities && achievements) {
      console.log('User Communities:', communities);
      console.log('User Achievements:', achievements);
    }
  }, [communities, achievements, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <AppText className="text-white text-xl">Loading...</AppText>
      </View>
    );
  }

  if (userError) {
    return (
      <View className="flex-1 justify-center items-center bg-black p-4">
        <AppText className="text-red-500 text-center mb-4">
          Error loading user: {userError.message || 'Unknown error'}
        </AppText>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <AppText className="text-white text-xl">User not found</AppText>
      </View>
    );
  }

  return (
    <ScrollView className="bg-black flex-1">
      {/* User Header */}
      <View className="p-4">
        <ProfileUiHeader userProfile={user.userProfile} />
      </View>

      {/* Simple placeholder */}
      <View className="px-4 py-6">
        <AppText className="text-white text-center">
          User profile loaded successfully!
        </AppText>
      </View>
    </ScrollView>
  );
}
