import { atom } from 'jotai';
import { api } from '../../utils/api';
import { authenticatedUserAtom } from '../auth.storage';

interface CryptoWallet {
  id: string;
  userBillingProfileId: string;
  address: string;
  chain: string;
  createdAt: string;
  updatedAt: string;
}

// For creation, we only need the address since other fields are derived
type CreateCryptoWalletInput = {
  address: string;
};

// Atoms for storing crypto wallets data
export const cryptoWalletsAtom = atom<CryptoWallet[]>([]);
export const cryptoWalletsLoadingAtom = atom<boolean>(false);
export const cryptoWalletsErrorAtom = atom<string | null>(null);

// This flag helps prevent race conditions when connecting wallets.
// Without it, if a user has a wallet connected when the page loads,
// the wallet connection effect might run before the wallets are fetched or the fetch even starts,
// potentially creating duplicate wallet entries.
export const walletsInitiallyLoadedAtom = atom<boolean>(false);

// Atom for fetching all crypto wallets
export const fetchCryptoWalletsAtom = atom(
  null,
  async (get, set) => {
    set(cryptoWalletsLoadingAtom, true);
    set(cryptoWalletsErrorAtom, null);

    try {
      const url = 'user-billing-profile-crypto-wallets';
      const response = await api.get(url);
      set(cryptoWalletsAtom, response.data);
      set(walletsInitiallyLoadedAtom, true);
      console.log('wallets', response.data)
      return response.data;
    } catch (error: any) {
      set(cryptoWalletsErrorAtom, error.message);
      throw error;
    } finally {
      set(cryptoWalletsLoadingAtom, false);
    }
  }
);

// Atom for fetching a single crypto wallet
export const fetchCryptoWalletAtom = atom(
  null,
  async (get, set, id: string) => {
    set(cryptoWalletsLoadingAtom, true);
    set(cryptoWalletsErrorAtom, null);

    try {
      const url = `user-billing-profile-crypto-wallets/${id}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      set(cryptoWalletsErrorAtom, error.message);
      throw error;
    } finally {
      set(cryptoWalletsLoadingAtom, false);
    }
  }
);

// Updated create wallet atom
export const createCryptoWalletAtom = atom(
  null,
  async (get, set, { address }: CreateCryptoWalletInput) => {
    set(cryptoWalletsLoadingAtom, true);
    set(cryptoWalletsErrorAtom, null);

    try {
      const authenticatedUser = get(authenticatedUserAtom);
      const userBillingProfileId = authenticatedUser?.userBillingProfile.id;

      if (!userBillingProfileId) {
        throw new Error('User billing profile not found');
      }

      const walletData = {
        userBillingProfileId,
        address,
        chain: 'Solana'
      };

      const url = 'user-billing-profile-crypto-wallets';
      const response = await api.post(url, walletData);

      console.log('crypto wallet created successfully:', response.data)
      const currentWallets = get(cryptoWalletsAtom);
      set(cryptoWalletsAtom, [...currentWallets, response.data]);

      return response.data;
    } catch (error: any) {
      set(cryptoWalletsErrorAtom, error.message);
      throw error;
    } finally {
      set(cryptoWalletsLoadingAtom, false);
    }
  }
);

// Atom for updating a crypto wallet
export const updateCryptoWalletAtom = atom(
  null,
  async (get, set, { id, data }: { id: string; data: Partial<CryptoWallet> }) => {
    set(cryptoWalletsLoadingAtom, true);
    set(cryptoWalletsErrorAtom, null);

    try {
      const url = `user-billing-profile-crypto-wallets/${id}`;
      const response = await api.put(url, data);

      const currentWallets = get(cryptoWalletsAtom);
      const updatedWallets = currentWallets.map(wallet =>
        wallet.id === id ? { ...wallet, ...response.data } : wallet
      );
      set(cryptoWalletsAtom, updatedWallets);

      return response.data;
    } catch (error: any) {
      set(cryptoWalletsErrorAtom, error.message);
      throw error;
    } finally {
      set(cryptoWalletsLoadingAtom, false);
    }
  }
);

// Atom for deleting a crypto wallet
export const deleteCryptoWalletAtom = atom(
  null,
  async (get, set, id: string) => {
    set(cryptoWalletsLoadingAtom, true);
    set(cryptoWalletsErrorAtom, null);

    try {
      const url = `user-billing-profile-crypto-wallets/${id}`;
      await api.delete(url);

      const currentWallets = get(cryptoWalletsAtom);
      set(cryptoWalletsAtom, currentWallets.filter(wallet => wallet.id !== id));
    } catch (error: any) {
      set(cryptoWalletsErrorAtom, error.message);
      throw error;
    } finally {
      set(cryptoWalletsLoadingAtom, false);
    }
  }
); 