import { atom } from 'jotai';
import { HttpStatusCode } from 'axios';
import { api } from '../utils/api';
import { ActionCreatorOptions } from '../types/action.types';
import { User, UserWithProfile } from '../types/user.types';
import { resolveUrl } from '../utils/app.utils';
import { authenticatedUserAtom } from './auth.storage';
import { fetchUserQuestsAtom } from './quests.storage';

export const selectedUserAtom = atom<UserWithProfile | null>(null);
const topUsersAtom = atom<UserWithProfile[]>([]);

export const userStorageErrorsAtom = atom({
  fetchOneUser: null,
  update: null,
  fetchTopUsers: null,
});

export const userLoadingAtom = atom(false);

export const fetchOneUserAtom = atom(
  null,
  async (
    get,
    set,
    id: User['id'],
    queryParams?: Record<string, unknown>,
    options?: ActionCreatorOptions,
  ) => {
    set(userLoadingAtom, true);
    set(userStorageErrorsAtom, { ...get(userStorageErrorsAtom), fetchOneUser: null });

    try {
      const response = await api.get(resolveUrl(`users/${id}`, queryParams));

      if (response.status === HttpStatusCode.Ok) {
        options?.onSuccess?.(response.data);

        set(selectedUserAtom, response.data);
      }
    } catch (error: any) {
      options?.onError?.(error.response?.data?.message || error.message || 'Failed to fetch user');
      set(userStorageErrorsAtom, {
        ...get(userStorageErrorsAtom),
        fetchOneUser: error.response?.data?.message || error.message || 'Failed to fetch user',
      });
    } finally {
      set(userLoadingAtom, false);
    }
  },
);

export const updateUserAtom = atom(
  null,
  async (get, set, id: User['id'], data: FormData, options?: ActionCreatorOptions) => {
    set(userStorageErrorsAtom, { ...get(userStorageErrorsAtom), update: null });

    try {
      const filteredData = new FormData();

      for (const [key, value] of data.entries()) {
        if (
          ![
            'id',
            'privyId',
            'experience',
            'role',
            'lastLoginAt',
            'userBillingProfileId',
            'refreshToken',
            'createdAt',
            'updatedAt',
          ].includes(key)
        ) {
          filteredData.append(key, value);
        }
      }

      const response = await api.putForm(`users/${id}`, filteredData);

      if (response.status === HttpStatusCode.Ok) {
        options?.onSuccess?.(response.data);

        // Update the authenticated user if it exists
        const authenticatedUser = get(authenticatedUserAtom);
        if (authenticatedUser?.id === id) {
          set(authenticatedUserAtom, {
            ...authenticatedUser,
            userProfile: response.data.userProfile,
          });
        }
      }
    } catch (error: any) {
      options?.onError?.(error.response?.data?.message || error.message || 'Failed to update user');
      set(userStorageErrorsAtom, {
        ...get(userStorageErrorsAtom),
        update: error.response?.data?.message || error.message || 'Failed to update user',
      });
    }
  },
);

export const topUsersByExperienceAtom = atom(
  get => get(topUsersAtom),
  async (get, set, queryParams?: Record<string, unknown>, options?: ActionCreatorOptions) => {
    set(userStorageErrorsAtom, { ...get(userStorageErrorsAtom), fetchTopUsers: null });

    try {
      const response = await api.get(
        resolveUrl('users', {
          ...queryParams,
          orderBy: { userProfile: { experience: 'desc' } },
          take: 50,
          include: { userProfile: true },
          where: {
            userProfile: {
              username: {
                not: {
                  startsWith: 'unknown_user_'
                }
              }
            }
          }
        }),
      );
      if (response.status === HttpStatusCode.Ok) {
        options?.onSuccess?.(response.data);
        set(
          topUsersAtom,
          response.data,
        );
      }
    } catch (error: any) {
      options?.onError?.(error.response?.data?.message || error.message || 'Failed to fetch top users');
      set(userStorageErrorsAtom, {
        ...get(userStorageErrorsAtom),
        fetchTopUsers: error.response?.data?.message || error.message || 'Failed to fetch top users',
      });
    }
  },
);

export const applyToWhitelistAtom = atom(
  null,
  async (get, set, options?: ActionCreatorOptions) => {
    try {
      const user = get(authenticatedUserAtom);
      if (!user) {
        return null;
      }
      const response = await api.post('users/request/whitelist');

      if (response.status === HttpStatusCode.Created) {
        set(authenticatedUserAtom, prev => prev ? { ...prev, isWhitelistRequested: true } : null);
        fetchUserQuestsAtom.write(get, set, user.id);
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error.response?.data?.message || error.message || 'Failed to apply to whitelist');
    }
  },
);