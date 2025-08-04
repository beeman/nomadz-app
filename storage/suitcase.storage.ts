import { atom } from 'jotai';
import { HttpStatusCode } from 'axios';
import { SuitcaseStorageErrors, Suitcase, OpenSuitcaseDto } from '../types/suitcase.types';
import { ActionCreatorOptions } from '../types/action.types';
import { api } from '../utils/api';
import { resolveUrl } from '../utils/app.utils';

export const suitcaseStorageErrorsAtom = atom<SuitcaseStorageErrors>({
  openSuitcase: null,
  prepareOpenSuitcaseTransaction: null,
  fetchUserSuitcases: null,
});

export const userSuitcasesAtom = atom<Suitcase[]>([]);

export const fetchUserSuitcasesAtom = atom(
  get => get(userSuitcasesAtom),
  async (
    get,
    set,
    userId: string,
    queryParams?: Record<string, unknown>,
    options?: ActionCreatorOptions,
  ): Promise<void> => {
    set(suitcaseStorageErrorsAtom, {
      ...get(suitcaseStorageErrorsAtom),
      fetchUserSuitcases: null,
    });

    try {
      const response = await api.get(resolveUrl(`users/${userId}/suitcases`, queryParams));

      if (response.status === HttpStatusCode.Ok) {
        options?.onSuccess?.(response.data);
        set(userSuitcasesAtom, response.data);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(suitcaseStorageErrorsAtom, {
        ...get(suitcaseStorageErrorsAtom),
        fetchUserSuitcases: 'Cannot fetch user suitcases',
      });
    }
  },
);

export const prepareOpenSuitcaseTransactionAtom = atom(
  null,
  async (get, set, id: Suitcase['id'], options?: ActionCreatorOptions): Promise<void> => {
    set(suitcaseStorageErrorsAtom, {
      ...get(suitcaseStorageErrorsAtom),
      prepareOpenSuitcaseTransaction: null,
    });

    try {
      const response = await api.post(resolveUrl(`suitcases/${id}/open/transaction`));

      if (response.status === HttpStatusCode.Created) {
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(suitcaseStorageErrorsAtom, {
        ...get(suitcaseStorageErrorsAtom),
        prepareOpenSuitcaseTransaction: 'Cannot prepare open suitcase transaction',
      });
    }
  },
);

export const openSuitcaseAtom = atom(
  null,
  async (
    get,
    set,
    id: Suitcase['id'],
    data: OpenSuitcaseDto,
    options?: ActionCreatorOptions,
  ): Promise<void> => {
    set(suitcaseStorageErrorsAtom, {
      ...get(suitcaseStorageErrorsAtom),
      openSuitcase: null,
    });

    try {
      const response = await api.post(resolveUrl(`suitcases/${id}/open`), data);

      if (response.status === HttpStatusCode.Created) {
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(suitcaseStorageErrorsAtom, {
        ...get(suitcaseStorageErrorsAtom),
        openSuitcase: 'Cannot open the suitcase',
      });
    }
  },
);
