import { useAtom, useAtomValue } from 'jotai';
import {
  cryptoWalletsAtom,
  cryptoWalletsLoadingAtom,
  cryptoWalletsErrorAtom,
  fetchCryptoWalletsAtom,
  fetchCryptoWalletAtom,
  createCryptoWalletAtom,
  updateCryptoWalletAtom,
  deleteCryptoWalletAtom,
  walletsInitiallyLoadedAtom,
} from '../../storage/billing/crypto-wallets.storage';

export const useCryptoWallets = () => {
  const [wallets] = useAtom(cryptoWalletsAtom);
  const isLoading = useAtomValue(cryptoWalletsLoadingAtom);
  const isInitiallyLoaded = useAtomValue(walletsInitiallyLoadedAtom);
  const error = useAtomValue(cryptoWalletsErrorAtom);

  const [, fetchWallets] = useAtom(fetchCryptoWalletsAtom);
  const [, fetchWallet] = useAtom(fetchCryptoWalletAtom);
  const [, createWallet] = useAtom(createCryptoWalletAtom);
  const [, updateWallet] = useAtom(updateCryptoWalletAtom);
  const [, deleteWallet] = useAtom(deleteCryptoWalletAtom);

  return {
    wallets,
    isLoading,
    isInitiallyLoaded,
    error,
    fetchWallets,
    fetchWallet,
    createWallet,
    updateWallet,
    deleteWallet,
  };
}; 