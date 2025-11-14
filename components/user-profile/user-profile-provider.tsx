import { User } from '@/types/user.types';
import React, { createContext, ReactNode, useContext } from 'react';
import { UserAchievementWithDetails } from '../../types/achievements.types';
import { useUserAchievementsQuery } from '../achievements/use-achievements';
import { useUserCommunitiesQuery } from '../communities/use-communities';
import { useUserQuery, useUserScoreQuery } from '../user/use-user';

// Type for user communities with nested community data
interface UserCommunity {
  userId: string;
  communityId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  community: {
    image: string;
  };
}

interface UserProfileContextType {
  // User data
  user: User;
  userLoading: boolean;
  userError: any;
  
  // Communities
  communities: UserCommunity[] | undefined;
  communitiesLoading: boolean;
  communitiesError: any;
  
  // Achievements
  achievements: UserAchievementWithDetails[] | undefined;
  achievementsLoading: boolean;
  achievementsError: any;
  
  // Score
  score: number | undefined;
  scoreLoading: boolean;
  scoreError: any;
  
  // Combined loading state
  isLoading: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

interface UserProfileProviderProps {
  children: ReactNode;
  userId: string;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ 
  children, 
  userId 
}) => {
  // Fetch user data
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useUserQuery(userId, !!userId);

  // Fetch communities data
  const {
    data: communities,
    isLoading: communitiesLoading,
    error: communitiesError,
  } = useUserCommunitiesQuery(userId, !!userId);

  // Fetch achievements data
  const {
    data: achievements,
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useUserAchievementsQuery(userId, !!userId);

  // Fetch score data
  const {
    data: score,
    isLoading: scoreLoading,
    error: scoreError,
  } = useUserScoreQuery(userId, !!userId);
    
  const isLoading = userLoading || communitiesLoading || achievementsLoading || scoreLoading; 

  const value: UserProfileContextType = {
    user,
    userLoading,
    userError,
    communities,
    communitiesLoading,
    communitiesError,
    achievements,
    achievementsLoading,
    achievementsError,
    score,
    scoreLoading,
    scoreError,
    isLoading,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
