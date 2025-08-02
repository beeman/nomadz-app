import { atom } from 'jotai';
import { HttpStatusCode } from 'axios';
import { ActionCreatorOptions } from '../../types/action.types';
import { ReferralInfo } from '../../types/userReferralInfo.types';
import { api } from '../../utils/api';
import { resolveUrl } from '../../utils/app.utils';

export const referralInfoAtom = atom<ReferralInfo | null>(null);

export const referralInfoErrorAtom = atom<string | null>(null);

export const fetchReferralInfoAtom = atom(
  get => get(referralInfoAtom),
  async (
    get,
    set,
    userId: string,
    queryParams?: Record<string, unknown>,
    options?: ActionCreatorOptions,
  ): Promise<void> => {
    set(referralInfoErrorAtom, null);

    try {
      const response = await api.get(resolveUrl(`users/${userId}/referral/info`, queryParams || {}));

      if (response.status === HttpStatusCode.Ok) {
        set(referralInfoAtom, response.data);
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      set(referralInfoErrorAtom, 'Failed to fetch referral info');
      options?.onError?.(error);
    }
  }
);
