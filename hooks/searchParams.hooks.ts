import { useAtom } from 'jotai';
import { searchParamsAtom, filterParamsAtom } from '../storage/searchParams.storage';
import { BookingSearchParams } from '../types/booking.types';

export const useSearchParams = () => {
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom);
  const [filterParams, setFilterParams] = useAtom(filterParamsAtom);

  const updateSearchParams = (updates: Partial<typeof searchParams>) => {
    setSearchParams(current => ({
      ...current,
      ...updates
    }));
  };

  const updateFilterParams = (updates: Partial<typeof filterParams>) => {
    setFilterParams(current => ({
      ...current,
      ...updates
    }));
  };

  // Helper to combine both params for API calls
  const getCombinedParams = (): BookingSearchParams => ({
    ...searchParams,
    ...filterParams
  });

  return {
    searchParams,
    updateSearchParams,
    filterParams,
    updateFilterParams,
    getCombinedParams
  };
}; 