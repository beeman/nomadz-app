import { useAtom } from 'jotai';
import {
  fetchUserAchievementsAtom,
  addUserAchievementAtom,
  removeUserAchievementAtom,
  userAchievementsAtom,
  userAchievementsErrorsAtom,
} from '../storage/userAchievements.storage';

export const useUserAchievements = () => {
  const [userAchievements, setUserAchievementsInStorage] = useAtom(userAchievementsAtom);
  const [errors, setUserAchievementErrorsInStorage] = useAtom(userAchievementsErrorsAtom);
  const [, fetchUserAchievements] = useAtom(fetchUserAchievementsAtom);
  const [, addUserAchievement] = useAtom(addUserAchievementAtom);
  const [, removeUserAchievement] = useAtom(removeUserAchievementAtom);

  return {
    userAchievements,
    errors,
    fetchUserAchievements,
    addUserAchievement,
    removeUserAchievement,
    setUserAchievementsInStorage,
    setUserAchievementErrorsInStorage,
  };
};
