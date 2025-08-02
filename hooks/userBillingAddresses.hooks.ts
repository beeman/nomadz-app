import { useAtom } from 'jotai';
import {
  userBillingAddressesAtom,
  userBillingAddressStorageErrorsAtom,
  fetchUserBillingAddressesAtom,
  createUserBillingAddressAtom,
  updateUserBillingAddressAtom,
} from '../storage/userBillingAddresses.storage';
import { ActionCreatorOptions } from '../types/action.types';
import { CreateBillingAddressDTO, UpdateBillingAddressDTO } from '../types/billing.types';

export const useUserBillingAddresses = () => {
  const [addresses] = useAtom(userBillingAddressesAtom);
  const [errors] = useAtom(userBillingAddressStorageErrorsAtom);
  const [, fetchAddresses] = useAtom(fetchUserBillingAddressesAtom);
  const [, createAddress] = useAtom(createUserBillingAddressAtom);
  const [, updateAddress] = useAtom(updateUserBillingAddressAtom);

  return {
    addresses,
    errors,
    fetchAddresses: (options?: ActionCreatorOptions) => fetchAddresses(options),
    createAddress: (
      data: Omit<CreateBillingAddressDTO, 'userBillingProfileId'>,
      options?: ActionCreatorOptions,
    ) => createAddress(data, options),
    updateAddress: (
      addressId: string,
      data: UpdateBillingAddressDTO,
      options?: ActionCreatorOptions,
    ) => updateAddress(addressId, data, options),
  };
};
