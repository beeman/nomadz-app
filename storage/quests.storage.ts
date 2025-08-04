import { atom } from 'jotai';
import { api } from '../utils/api';
import { Quest, UserToQuest } from '../types/quests.types';
import { authenticatedUserAtom, fetchAuthenticatedUserAtom } from './auth.storage';
import { resolveUrl } from '../utils/app.utils';
import { notificationsAtom } from './notification.storage';
import { NOTIFICATION_MESSAGES } from '../constants/notifications.constants';
import { ActionCreatorOptions } from '../types/action.types';
import { HttpStatusCode } from 'axios';

// Atoms for storing quests data
export const userQuestsAtom = atom<UserToQuest[]>([]);
export const allQuestsAtom = atom<Quest[]>([]);
export const questsLoadingAtom = atom<boolean>(false);
export const questsErrorAtom = atom<string | null>(null);

// Atom to fetch user quests
export const fetchUserQuestsAtom = atom(
  get => get(userQuestsAtom),
  async (get, set, userId: string, options?: ActionCreatorOptions) => {
    set(questsLoadingAtom, true);
    set(questsErrorAtom, null);

    try {
      const response = await api.get(`users/${userId}/quests`);
      set(userQuestsAtom, response.data);
      options?.onSuccess?.(response.data);
    } catch (error: any) {
      set(questsErrorAtom, error.message);
    } finally {
      set(questsLoadingAtom, false);
    }
  },
);

// Atom to fetch all quests
export const fetchAllQuestsAtom = atom(
  get => get(allQuestsAtom),
  async (get, set) => {
    set(questsLoadingAtom, true);
    set(questsErrorAtom, null);

    try {
      const response = await api.get(`quests`);
      set(allQuestsAtom, response.data);
    } catch (error: any) {
      set(questsErrorAtom, error.message);
    } finally {
      set(questsLoadingAtom, false);
    }
  },
);

// Atom to fetch quest by tag
export const fetchQuestByTagAtom = atom(
  null,
  async (get, set, tag: string, options?: ActionCreatorOptions) => {
    set(questsLoadingAtom, true);
    set(questsErrorAtom, null);

    try {
      const url = resolveUrl(`/quests`, { where: { tag } });
      const response = await api.get(url);

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error('Cannot fetch the quest by its tag');
      }

      options?.onSuccess?.(response.data?.[0]);
      return response.data?.[0] || null;
    } catch (error: any) {
      options?.onError?.(error.message);
      set(questsErrorAtom, error.message);
    } finally {
      set(questsLoadingAtom, false);
    }
  },
);

// Atom to accomplish a quest
export const accomplishQuestAtom = atom(
  null,
  async (get, set, questId: string, refetchUser: boolean = true) => {
    const userId = get(authenticatedUserAtom)?.id;
    if (!userId) return;

    try {
      const response = await api.post(`users/${userId}/quests`, { questId });
      const currentQuests = get(userQuestsAtom);
      set(userQuestsAtom, [...currentQuests, response.data]);

      /* 
        Note: In the future, the whole quest should be passed to this function, and the name should be taken directly from the quest object.
      */

      // Fetch quest by id
      const { data: quest } = await api.get(`quests/${questId}`);

      // If quest name is available, create a notification
      if (quest?.name) {
        const notificationResponse = await api.post(`users/${userId}/notifications`, {
          content: NOTIFICATION_MESSAGES.QUEST.ACCOMPLISHED(quest.name),
        });

        // Add new notification to notificationsAtom
        const currentNotifications = get(notificationsAtom);
        set(notificationsAtom, [...currentNotifications, notificationResponse.data]);
      }

      if (refetchUser) {
        // Refetch authenticated user
        await set(fetchAuthenticatedUserAtom);
      }
    } catch (error: any) {
      set(questsErrorAtom, error.message);
    }
  },
);
