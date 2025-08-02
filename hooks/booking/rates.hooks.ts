import { useAtom, useAtomValue } from 'jotai';
import {
  fetchApartmentRatesAtom,
  selectedApartmentRatesLoadingAtom,
} from '../../storage/booking/rates.storage';

export const useRates = () => {
  const [selectedApartmentRates, fetchApartmentRates] = useAtom(fetchApartmentRatesAtom);
  const isApartmentRatesLoading = useAtomValue(selectedApartmentRatesLoadingAtom);

  return {
    selectedApartmentRates,
    fetchApartmentRates,
    isApartmentRatesLoading,
  };
}; 