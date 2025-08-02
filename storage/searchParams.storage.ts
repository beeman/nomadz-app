import { atom } from 'jotai';
import { BookingSearchParams, GetApartmentsSort } from '../types/booking.types';

// Core search parameters (for SearchBar)
export type CoreSearchParams = Pick<BookingSearchParams, 'regionId' | 'nameIncludes' | 'checkin' | 'checkout' | 'guests'>;

export const defaultSearchParams: CoreSearchParams = {
  regionId: null,
  nameIncludes: null,
  checkin: '',
  checkout: '',
  guests: {
    adults: 1,
    children: [],
  }
};

// Filter parameters (for FilterMenu)
export type FilterParams = Pick<BookingSearchParams, 'categories' | 'sort' | 'limit' | 'page' | 'minPrice' | 'maxPrice' | 'hasFreeCancellation'>;

export const defaultFilterParams: FilterParams = {
  categories: [],
  sort: GetApartmentsSort.MostRelevant,
  limit: 24,
  page: 1,
  minPrice: 0,
  maxPrice: null,
  hasFreeCancellation: false
};

export const searchParamsAtom = atom<CoreSearchParams>(defaultSearchParams);
export const filterParamsAtom = atom<FilterParams>(defaultFilterParams); 