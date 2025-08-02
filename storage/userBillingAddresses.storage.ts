import { atom } from 'jotai';
import { HttpStatusCode } from 'axios';
import { api } from '../utils/api';
import { ActionCreatorOptions } from '../types/action.types';
import { authenticatedUserAtom } from './auth.storage';
import { BillingAddress, CreateBillingAddressDTO, UpdateBillingAddressDTO } from '../types/billing.types'

export const userBillingAddressStorageErrorsAtom = atom({
  fetch: null,
  create: null,
  update: null,
});

export const userBillingAddressesAtom = atom<BillingAddress[]>([]);

export const fetchUserBillingAddressesAtom = atom(
  null,
  async (get, set, options?: ActionCreatorOptions) => {
    const user = get(authenticatedUserAtom);
    if (!user?.userBillingProfile?.id) return;

    set(userBillingAddressStorageErrorsAtom, { ...get(userBillingAddressStorageErrorsAtom), fetch: null });

    try {
      const response = await api.get(`user-billing-profiles/${user.userBillingProfile.id}/addresses`);

      if (response.status === HttpStatusCode.Ok) {
        set(userBillingAddressesAtom, response.data);
        console.log('Addresses received:', response.data)
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error.response?.data);
      set(userBillingAddressStorageErrorsAtom, {
        ...get(userBillingAddressStorageErrorsAtom),
        fetch: error.response?.data,
      });
    }
  }
);

export const createUserBillingAddressAtom = atom(
  null,
  async (get, set, data: CreateBillingAddressDTO, options?: ActionCreatorOptions) => {
    const user = get(authenticatedUserAtom);
    if (!user?.userBillingProfile?.id) return;

    set(userBillingAddressStorageErrorsAtom, { ...get(userBillingAddressStorageErrorsAtom), create: null });

    try {
      const response = await api.post(
        `user-billing-profiles/${user.userBillingProfile.id}/addresses`,
        { ...data, userBillingProfileId: user.userBillingProfile.id }
      );

      if (response.status === HttpStatusCode.Created) {
        set(userBillingAddressesAtom, [...get(userBillingAddressesAtom), response.data]);
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error.response?.data);
      set(userBillingAddressStorageErrorsAtom, {
        ...get(userBillingAddressStorageErrorsAtom),
        create: error.response?.data,
      });
    }
  }
);

export const updateUserBillingAddressAtom = atom(
  null,
  async (get, set, addressId: string, data: UpdateBillingAddressDTO, options?: ActionCreatorOptions) => {
    set(userBillingAddressStorageErrorsAtom, { ...get(userBillingAddressStorageErrorsAtom), update: null });

    try {
      const response = await api.put(`user-billing-addresses/${addressId}`, data);

      if (response.status === HttpStatusCode.Ok) {
        const updatedAddresses = get(userBillingAddressesAtom).map(address =>
          address.id === addressId ? { ...address, ...response.data } : address
        );
        set(userBillingAddressesAtom, updatedAddresses);
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error.response?.data);
      set(userBillingAddressStorageErrorsAtom, {
        ...get(userBillingAddressStorageErrorsAtom),
        update: error.response?.data,
      });
    }
  }
); 