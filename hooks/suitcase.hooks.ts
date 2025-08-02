import {
  openSuitcaseAtom,
  fetchUserSuitcasesAtom,
  userSuitcasesAtom,
  suitcaseStorageErrorsAtom,
  prepareOpenSuitcaseTransactionAtom,
} from '../storage/suitcase.storage';
import { useAtom } from 'jotai';

export const useSuitcase = () => {
  const [suitcases, setSuitcases] = useAtom(userSuitcasesAtom);
  const [, fetchUserSuitcases] = useAtom(fetchUserSuitcasesAtom);
  const [, openSuitcase] = useAtom(openSuitcaseAtom);
  const [, prepareOpenSuitcaseTransaction] = useAtom(prepareOpenSuitcaseTransactionAtom);
  const [errors] = useAtom(suitcaseStorageErrorsAtom);

  return {
    suitcases,
    errors,
    fetchUserSuitcases,
    openSuitcase,
    prepareOpenSuitcaseTransaction,
    setSuitcases,
  };
};
