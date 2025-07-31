import { UserWithProfile } from "./user.types";

export interface ReferralInfo {
  referralCode: string;
  userPublicKey: string;
  assetPublicKey: string;
  referralHistory: ReferralHistoryEntity[];
  createdAt: Date;
  xp: number;
  level: number;
  luck: number;
}

export interface ReferralHistoryEntity {
  invitee: UserWithProfile;
  confirmed: boolean;
  level?: number;
  referrer?: string;
}
