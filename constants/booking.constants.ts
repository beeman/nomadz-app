import { GetApartmentsSort, PriceIntervalKey } from '../types/booking.types';

export const PRICE_INTERVALS: Record<PriceIntervalKey, string> = {
  month: 'Monthly',
  year: 'Annually',
  day: 'Per night'
};

export const SORT_OPTIONS: Record<GetApartmentsSort, string> = {
  [GetApartmentsSort.MostRelevant]: 'most relevant',
  [GetApartmentsSort.PriceAscending]: 'price (lowest first)', 
  [GetApartmentsSort.PriceDescending]: 'price (highest first)',
  [GetApartmentsSort.NearestToCityCenter]: 'distance from city centre',
  [GetApartmentsSort.BestReviews]: 'best reviews',
};

export const TESTING_BOOKING_HID = 8473727;