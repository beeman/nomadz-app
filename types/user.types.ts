import { UserRoles, UserStatuses } from '../enums';
import { Suitcase } from './suitcase.types';

export type User = {
  privyId: string;
  id: string;
  role: (typeof UserRoles)[keyof typeof UserRoles];
  lastLoginAt: Date | null;
  userProfileId: string;
  userBillingProfileId: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: (typeof UserStatuses)[keyof typeof UserStatuses];
  isWhitelisted: boolean;
  isWhitelistRequested: boolean;
  userProfile?: UserProfile;
  suitcases?: Suitcase[];
};

export type UserWithProfile = User & {
  userProfile: UserProfile;
};

export type UserProfile = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  username: string;
  experience: number;
  authWalletPublicKey: string | null;
  image: string | null;
  bio: string | null;
  residency: string | null;
  twitterUsername: string | null;
  luck: number,
};

export type UserBillingProfile = {
  id: string;
  stripeCustomerId: string;
  publicKey: string | null;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
};
