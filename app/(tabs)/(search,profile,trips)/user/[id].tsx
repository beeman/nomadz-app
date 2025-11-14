import { AppText } from '@/components/app-text';
import { UserProfileDetails } from '@/components/user-profile/user-profile-details';
import { UserProfileProvider } from '@/components/user-profile/user-profile-provider';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <AppText className="text-white text-xl">No user ID provided</AppText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <UserProfileProvider userId={id}>
        <UserProfileDetails />
      </UserProfileProvider>
    </View>
  );
}
