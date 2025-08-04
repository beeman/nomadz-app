import { AchievementType } from '../enums';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  badge: string;
  experienceReward: number;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  type: AchievementType;
}

export interface AchievementStorageErrors {
  fetchAllAchievements: string | null;
  fetchOneAchievement: string | null;
  fetchAchievementsCount: string | null;
}

export interface CreateAchievementDto {
  name: string;
  description: string;
  badge: string;
  experienceReward: string;
}

export interface ClaimAchievementTransaction {
  id: string;
  hash: string;
  userId: string;
  achievementId: string;
  signature: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAchievement {
  confirmationImage: string;
  claimAchievementTransactionId: string;
  claimAchievementTransaction: ClaimAchievementTransaction;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  achievementId: string;
}

export interface UserAchievementWithDetails extends UserAchievement {
  achievement: Achievement;
}

export interface CreateUserAchievementDto
  extends Pick<UserAchievement, 'achievementId'>,
    Pick<Partial<UserAchievement>, 'userId' | 'confirmationImage'> {}
