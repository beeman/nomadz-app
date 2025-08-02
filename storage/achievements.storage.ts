import { atom } from 'jotai';
import { HttpStatusCode } from 'axios';
import { AchievementStorageErrors, Achievement } from '../types/achievements.types';
import { ActionCreatorOptions } from '../types/action.types';
import { api } from '../utils/api';
import { resolveUrl } from '../utils/app.utils';

export const achievementStorageErrorsAtom = atom<AchievementStorageErrors>({
  fetchAllAchievements: null,
  fetchOneAchievement: null,
  fetchAchievementsCount: null,
});

export const achievementsAtom = atom<Achievement[]>([]);
export const selectedAchievementAtom = atom<Achievement | null>(null);
export const achievementsCountAtom = atom(0);

export const fetchAllAchievementsAtom = atom(
  get => get(achievementsAtom),
  async (
    get,
    set,
    options?: ActionCreatorOptions,
  ): Promise<void> => {
    set(achievementStorageErrorsAtom, {
      ...get(achievementStorageErrorsAtom),
      fetchAllAchievements: null,
    });

    try {
      const response = await api.get(resolveUrl(`achievements`, options?.queryParams));

      if (response.status === HttpStatusCode.Ok) {
        options?.onSuccess?.(response.data);
        set(achievementsAtom, response.data);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(achievementStorageErrorsAtom, {
        ...get(achievementStorageErrorsAtom),
        fetchAllAchievements: 'Cannot fetch the list of achievements',
      });
    }
  },
);

export const fetchAchievementByIdAtom = atom(
  get => get(selectedAchievementAtom),
  async (
    get,
    set,
    id: Achievement['id'],
    queryParams?: Record<string, unknown>,
    options?: ActionCreatorOptions,
  ): Promise<void> => {
    set(achievementStorageErrorsAtom, {
      ...get(achievementStorageErrorsAtom),
      fetchOneAchievement: null,
    });

    try {
      const response = await api.get(resolveUrl(`achievements/${id}`, queryParams));

      if (response.status === HttpStatusCode.Ok) {
        options?.onSuccess?.(response.data);
        set(selectedAchievementAtom, response.data);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(achievementStorageErrorsAtom, {
        ...get(achievementStorageErrorsAtom),
        fetchOneAchievement: 'Cannot fetch the achievement by id',
      });
    }
  },
);

export const fetchAchievementsCountAtom = atom(
  get => get(achievementsCountAtom),
  async (
    get,
    set,
    queryParams?: Record<string, unknown>,
    options?: ActionCreatorOptions,
  ): Promise<void> => {
    set(achievementStorageErrorsAtom, {
      ...get(achievementStorageErrorsAtom),
      fetchAchievementsCount: null,
    });

    try {
      const response = await api.get(resolveUrl(`utils/count/achievements`, queryParams));

      if (response.status === HttpStatusCode.Ok) {
        options?.onSuccess?.(response.data.count || 0);
        set(achievementsCountAtom, response.data.count || 0);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(achievementStorageErrorsAtom, {
        ...get(achievementStorageErrorsAtom),
        fetchAchievementsCount: 'Cannot fetch the total number of achievements',
      });
    }
  },
);