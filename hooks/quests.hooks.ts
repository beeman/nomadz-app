import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';
import {
  fetchUserQuestsAtom,
  accomplishQuestAtom,
  fetchAllQuestsAtom,
  fetchQuestByTagAtom,
  questsLoadingAtom,
  questsErrorAtom,
  userQuestsAtom,
} from '../storage/quests.storage';
import { authenticatedUserAtom } from '../storage/auth.storage';
import { UserToQuest } from '../types/quests.types';

export const useQuests = () => {
  const [_, setUserQuestsInStorage] = useAtom(userQuestsAtom);
  const [userQuests, fetchUserQuests] = useAtom(fetchUserQuestsAtom);
  const [, accomplishQuest] = useAtom(accomplishQuestAtom);
  const [allQuests, fetchAllQuests] = useAtom(fetchAllQuestsAtom);
  const [, fetchQuestByTag] = useAtom(fetchQuestByTagAtom);
  const isLoading = useAtomValue(questsLoadingAtom);
  const error = useAtomValue(questsErrorAtom);
  const authenticatedUser = useAtomValue(authenticatedUserAtom);

  const fetchCurrentUserQuests = useCallback(async (includeQuests: boolean = false) => {
    const userId = authenticatedUser?.id;

    const options = {
      include: {
        quest: includeQuests,
      },
      onSuccess: ((res: UserToQuest[]) => {
        setUserQuestsInStorage(res);
      }),
    }

    if (userId) {
      await fetchUserQuests(userId, options);
    }

    return userQuests;
  }, [authenticatedUser, fetchUserQuests, setUserQuestsInStorage, userQuests]);

  return {
    userQuests,
    fetchUserQuests,
    accomplishQuest,
    allQuests,
    fetchAllQuests,
    fetchQuestByTag,
    fetchCurrentUserQuests,
    setUserQuestsInStorage,
    isLoading,
    error,
  };
}; 