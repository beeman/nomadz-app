import { QuestTags } from '../enums/Quests';

// Mapping of achievement names to their corresponding quest tags
// This allows for automatic quest completion when specific achievements are claimed
export const ACHIEVEMENT_TO_QUEST_MAPPING: Record<string, QuestTags> = {
  'Crossroads': QuestTags.ClaimCrossroadsEvent,
  // Add more mappings here as needed:
  // 'Country Name': QuestTags.ClaimCountry,
  // 'Event Name': QuestTags.ClaimEvent,
};

// Helper function to get quest tag for an achievement
export const getQuestTagForAchievement = (achievementName: string): QuestTags | null => {
  return ACHIEVEMENT_TO_QUEST_MAPPING[achievementName] || null;
}; 