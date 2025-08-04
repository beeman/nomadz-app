import { User } from './user.types';

export interface Community {
  id: string;
  tag: string | null;
  name: string;
  description: string;
  image: string | null;
  backgroundImage: string | null;
  membersLimit: number | null;
  creatorId: User['id'];
  createdAt: Date;
  updatedAt: Date;
  usersToCommunities?: UserToCommunity[];
}

export interface UserToCommunity {
  userId: string;
  communityId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User; // Assuming you have a User type defined elsewhere
  community?: Community;
}

// DTOs for creating/updating communities
export interface CreateCommunityDTO {
  tag?: string;
  name: string;
  description: string;
  image?: string;
  backgroundImage?: string;
  membersLimit?: number;
}

export interface UpdateCommunityDTO extends Partial<CreateCommunityDTO> {}

// Member management types
export interface AddMemberDTO {
  userId: string;
  communityId: string;
}

export type RemoveMemberDTO = AddMemberDTO;
