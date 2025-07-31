export type Quest = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  tag: string;
  categoryId: string | null;
  description: string;
  experienceReward: number;
  experienceThreshold: number;
}

export type UserToQuest = {
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  questId: string;
  details: Record<string, any>;
}