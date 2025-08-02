import { HttpStatusCode } from 'axios';
import { atom } from 'jotai';
import {
  UserAchievement,
  UserAchievementWithDetails,
  Achievement,
} from '../types/achievements.types';
import { ActionCreatorOptions } from '../types/action.types';
import { api } from '../utils/api';
import { resolveUrl } from '../utils/app.utils';
import { authenticatedUserAtom } from './auth.storage';
import { User } from '../types/user.types';

export const userAchievementsAtom = atom<UserAchievement[] | UserAchievementWithDetails[]>([]);
export const userAchievementsErrorsAtom = atom<{
  fetchUserAchievements: string | null;
  addUserAchievement: string | null;
  removeUserAchievement: string | null;
}>({
  fetchUserAchievements: null,
  addUserAchievement: null,
  removeUserAchievement: null,
});

export const fetchUserAchievementsAtom = atom(
  get => get(userAchievementsAtom),
  async (get, set, options?: ActionCreatorOptions, userIdParam?: User['id']): Promise<void> => {
    set(userAchievementsErrorsAtom, {
      ...get(userAchievementsErrorsAtom),
      fetchUserAchievements: null,
    });

    try {
      const userId = userIdParam || get(authenticatedUserAtom)?.id;
      if (!userId) {
        throw new Error('Please, log in to complete this action.');
      }

      const response = await api.get(
        resolveUrl(`users/${userId}/achievements`, options?.queryParams || {}),
      );

      if (response.status === HttpStatusCode.Ok) {
        set(userAchievementsAtom, response.data);
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      set(userAchievementsErrorsAtom, {
        ...get(userAchievementsErrorsAtom),
        fetchUserAchievements: 'Cannot fetch user achievements',
      });
      options?.onError?.(error);
    }
  },
);

export const addUserAchievementAtom = atom(
  null,
  async (
    get,
    set,
    {
      payer,
      claimAchievementTransactionId,
      serializedTransaction,
      signedSerializedTransaction,
      signature,
      confirmationImage,
      achievement,
    }: {
      payer: string;
      claimAchievementTransactionId: string;
      serializedTransaction: string;
      signedSerializedTransaction: string;
      signature: string;
      confirmationImage: File;
      achievement: Achievement;
    },
    options?: ActionCreatorOptions,
  ): Promise<void> => {
    set(userAchievementsErrorsAtom, {
      ...get(userAchievementsErrorsAtom),
      addUserAchievement: null,
    });

    const formData = new FormData();
    formData.append('payer', payer);
    formData.append('claimAchievementTransactionId', claimAchievementTransactionId);
    formData.append('serializedTransaction', serializedTransaction);
    formData.append('signedSerializedTransaction', signedSerializedTransaction);
    formData.append('signature', signature);
    formData.append('confirmationImage', confirmationImage);

    try {
      const response = await api.postForm(resolveUrl(`users/claim/achievement/approve`), formData);

      if (response.status === HttpStatusCode.Created) {
        set(userAchievementsAtom, [
          ...get(userAchievementsAtom),
          { ...response.data, achievement },
        ]);
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      set(userAchievementsErrorsAtom, {
        ...get(userAchievementsErrorsAtom),
        addUserAchievement: 'Cannot add user achievement',
      });
      options?.onError?.(error);
    }
  },
);

export const removeUserAchievementAtom = atom(
  null,
  async (
    get,
    set,
    { userId, achievementId }: { userId: string; achievementId: string },
    options?: ActionCreatorOptions,
  ): Promise<void> => {
    set(userAchievementsErrorsAtom, {
      ...get(userAchievementsErrorsAtom),
      removeUserAchievement: null,
    });

    try {
      const response = await api.delete(
        resolveUrl(`users/${userId}/achievements/${achievementId}`),
      );

      if (response.status === HttpStatusCode.Ok || response.status === HttpStatusCode.NoContent) {
        set(
          userAchievementsAtom,
          get(userAchievementsAtom).filter(a => a.achievementId !== achievementId),
        );
        options?.onSuccess?.();
      }
    } catch (error: any) {
      set(userAchievementsErrorsAtom, {
        ...get(userAchievementsErrorsAtom),
        removeUserAchievement: 'Cannot remove user achievement',
      });
      options?.onError?.(error);
    }
  },
);
