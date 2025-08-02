import { useAtom, useAtomValue } from 'jotai';
import {
  fetchApartmentAtom,
  fetchBookingApartmentsAtom,
  fetchRandomApartmentsAtom,
  fetchSearchSuggestionsAtom,
  bookingApartmentsLoadingAtom,
  randomApartmentsLoadingAtom,
  searchSuggestionsLoadingAtom,
} from '../../storage/booking/apartment.storage';

export const useApartments = () => {
  const [selectedApartment, fetchApartment] = useAtom(fetchApartmentAtom);
  const [bookingApartments, fetchBookingApartments] = useAtom(fetchBookingApartmentsAtom);
  const [randomApartments, fetchRandomApartments] = useAtom(fetchRandomApartmentsAtom);
  const [searchSuggestions, fetchSearchSuggestions] = useAtom(fetchSearchSuggestionsAtom);
  const isBookingApartmentsLoading = useAtomValue(bookingApartmentsLoadingAtom);
  const isRandomApartmentsLoading = useAtomValue(randomApartmentsLoadingAtom);
  const isSearchSuggestionsLoading = useAtomValue(searchSuggestionsLoadingAtom);

  return {
    selectedApartment,
    fetchApartment,
    bookingApartments,
    fetchBookingApartments,
    randomApartments,
    fetchRandomApartments,
    searchSuggestions,
    fetchSearchSuggestions,
    isBookingApartmentsLoading,
    isRandomApartmentsLoading,
    isSearchSuggestionsLoading,
  };
};