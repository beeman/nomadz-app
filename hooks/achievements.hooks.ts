import {
  fetchAllAchievementsAtom,
  fetchAchievementByIdAtom,
  fetchAchievementsCountAtom,
  achievementsAtom,
  achievementStorageErrorsAtom,
  selectedAchievementAtom,
} from '../storage/achievements.storage'
import { useAtom } from 'jotai';

export const useAchievements = () => {
  const [achievements, setAchievementsInStorage] = useAtom(achievementsAtom);
  const [achievement, setSelectedAchievementInStorage] = useAtom(selectedAchievementAtom);
  const [, fetchAllAchievements] = useAtom(fetchAllAchievementsAtom);
  const [, fetchAchievementById] = useAtom(fetchAchievementByIdAtom);
  const [achievementsCount, fetchAchievementsCount] = useAtom(fetchAchievementsCountAtom);
  const [errors, setAchievementErrorsInStorage] = useAtom(achievementStorageErrorsAtom);

  return {
    achievements,
    achievement,
    achievementsCount,
    errors,
    fetchAllAchievements,
    fetchAchievementById,
    fetchAchievementsCount,
    setAchievementsInStorage,
    setSelectedAchievementInStorage,
    setAchievementErrorsInStorage,
  };
};
