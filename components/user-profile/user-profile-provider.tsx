import React, { createContext, ReactNode, useContext } from 'react';
import { UserAchievementWithDetails } from '../../types/achievements.types';
import { Community } from '../../types/community.types';
import { UserScore, useUserQuery } from '../user/use-user';

interface UserProfileContextType {
  // User data
  user: any | null;
  userLoading: boolean;
  userError: any;
  
  // Communities
  communities: Community[] | undefined;
  communitiesLoading: boolean;
  communitiesError: any;
  
  // Achievements
  achievements: UserAchievementWithDetails[] | undefined;
  achievementsLoading: boolean;
  achievementsError: any;
  
  // Score
  score: UserScore | undefined;
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
    
  const isLoading = userLoading; 

  const value: UserProfileContextType = {
    user,
    userLoading,
    userError,
    communities: undefined,
    communitiesLoading: false,
    communitiesError: null,
    achievements: undefined,
    achievementsLoading: false,
    achievementsError: null,
    score: undefined,
    scoreLoading: false,
    scoreError: null,
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
