import { atom } from 'jotai';
import { api } from '../../utils/api'
import { resolveUrl } from '../../utils/app.utils';
import { prepareRequestParams } from '../../utils/params.utils';
import { authenticatedUserAtom } from '../auth.storage';
import { getPriceWithCommission } from '../../utils/rate.utils';

// Define atoms for storing data
export const selectedApartmentAtom = atom<any>(null);
export const bookingApartmentsAtom = atom<any[]>([]);
export const randomApartmentsAtom = atom<any[]>([]);
export const searchSuggestionsAtom = atom<any[]>([]);

// Define atoms for storing errors
export const apartmentErrorsAtom = atom({
  fetchApartment: null,
  fetchBookingApartments: null,
  fetchRandomApartments: null,
  fetchSearchSuggestions: null,
});

// Helper function to add commission to apartment rates for display purposes
const addCommissionToApartmentRates = (apartments: any[]): any[] => {
  return apartments.map(apartment => {
    if (!apartment.rates || !Array.isArray(apartment.rates)) {
      return apartment;
    }

    return {
      ...apartment,
      rates: apartment.rates.map((rate: any) => {
        if (!rate.payment_options?.payment_types?.[0]) {
          return rate;
        }

        const paymentType = rate.payment_options.payment_types[0];
        const originalAmount = Number(paymentType.show_amount) || 0;

        // Use the utility function to calculate commission
        const commissionAmount = getPriceWithCommission(rate);

        return {
          ...rate,
          payment_options: {
            ...rate.payment_options,
            payment_types: [
              {
                ...paymentType,
                // Add commission for display purposes only
                show_amount_with_commission: commissionAmount.toFixed(2),
                // Keep original amount for backend communication
                show_amount: paymentType.show_amount,
              },
              ...rate.payment_options.payment_types.slice(1),
            ],
          },
        };
      }),
    };
  });
};

// Atom to fetch a single apartment
export const fetchApartmentAtom = atom(
  (get) => get(selectedApartmentAtom),
  async (get, set, hid: string) => {
    set(apartmentErrorsAtom,
      {
        ...get(apartmentErrorsAtom),
        fetchApartment: null,
      }
    );
    try {
      const response = await api.get(`bookings/apartments/${hid}`);
      set(selectedApartmentAtom, response.data);
    } catch (error: any) {
      set(apartmentErrorsAtom,
        {
          ...get(apartmentErrorsAtom),
          fetchApartment: error,
        }
      );
    }
  }
);

export const bookingApartmentsLoadingAtom = atom<boolean>(false);
export const randomApartmentsLoadingAtom = atom<boolean>(false);
export const searchSuggestionsLoadingAtom = atom<boolean>(false);

// Atom to fetch booking apartments with query parameters
export const fetchBookingApartmentsAtom = atom(
  (get) => get(bookingApartmentsAtom),
  async (get, set, params: any) => {
    const authenticatedUser = get(authenticatedUserAtom);
    set(apartmentErrorsAtom, { ...get(apartmentErrorsAtom), fetchBookingApartments: null });
    set(bookingApartmentsLoadingAtom, true);

    try {
      // Check if coordinates search is provided
      const hasCoordinates = (
        typeof params.latitude === 'number' &&
        typeof params.longitude === 'number' &&
        typeof params.radius === 'number' &&
        params.radius > 0
      );

      // Check if region search is provided
      const hasRegion = typeof params.regionId === 'number' && params.regionId > 0;

      // Check if name search is provided
      const hasNameSearch = typeof params.nameIncludes === 'string' && params.nameIncludes.trim().length > 0;

      // If no search criteria is provided, fallback to random apartments
      if (!hasCoordinates && !hasRegion && !hasNameSearch) {
        try {
          await fetchRandomApartmentsAtom.write(get, set, params);
        } catch (error) {
          console.error('Error fetching random apartments:', error);
        }
        return;
      }

      // Prepare search params - prioritize coordinates, then region, then name
      let searchParams;
      if (hasCoordinates) {
        searchParams = {
          ...params,
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius
        };
        // Remove unused params
        delete searchParams.regionId;
        delete searchParams.nameIncludes;
      } else if (hasRegion) {
        searchParams = {
          ...params,
          regionId: params.regionId
        };
        // Remove unused params
        delete searchParams.latitude;
        delete searchParams.longitude;
        delete searchParams.radius;
        delete searchParams.nameIncludes;
      } else if (hasNameSearch) {
        searchParams = {
          ...params,
          nameIncludes: decodeURIComponent(params.nameIncludes.trim())
        };
        // Remove unused params
        delete searchParams.latitude;
        delete searchParams.longitude;
        delete searchParams.radius;
        delete searchParams.regionId;
      }

      const searchParamsWithResidency = prepareRequestParams(
        searchParams,
        authenticatedUser?.userProfile
      );
      const url = resolveUrl('bookings/apartments', searchParamsWithResidency);
      const response = await api.get(url);

      // Add commission to apartment rates for display purposes
      const apartmentsWithCommission = addCommissionToApartmentRates(response.data);
      set(bookingApartmentsAtom, apartmentsWithCommission);
    } catch (error: any) {
      set(apartmentErrorsAtom, {
        ...get(apartmentErrorsAtom),
        fetchBookingApartments: error.message
      });
    } finally {
      set(bookingApartmentsLoadingAtom, false); // Set loading to false
    }
  }
);

// Atom to fetch random apartments
export const fetchRandomApartmentsAtom = atom(
  (get) => get(randomApartmentsAtom),
  async (get, set, params: any = {}) => {
    const authenticatedUser = get(authenticatedUserAtom);
    set(apartmentErrorsAtom, { ...get(apartmentErrorsAtom), fetchRandomApartments: null });
    set(randomApartmentsLoadingAtom, true); // Set loading to true
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      const defaultParams = {
        page: 1,
        limit: 24,
        checkIn: tomorrow.toISOString().split('T')[0],
        checkOut: dayAfterTomorrow.toISOString().split('T')[0]
      };
      const mergedParams = prepareRequestParams(
        { ...defaultParams, ...params },
        authenticatedUser?.userProfile
      );
      const response = await api.get(resolveUrl('bookings/random/apartments', mergedParams));

      // Add commission to apartment rates for display purposes
      const apartmentsWithCommission = addCommissionToApartmentRates(response.data);
      set(randomApartmentsAtom, apartmentsWithCommission);
    } catch (error: any) {
      set(apartmentErrorsAtom, { ...get(apartmentErrorsAtom), fetchRandomApartments: error.message });
    } finally {
      set(randomApartmentsLoadingAtom, false); // Set loading to false
    }
  }
);

// Atom to fetch search suggestions
export const fetchSearchSuggestionsAtom = atom(
  (get) => get(searchSuggestionsAtom),
  async (get, set, searchTerm: string) => {
    set(apartmentErrorsAtom, { ...get(apartmentErrorsAtom), fetchSearchSuggestions: null });
    set(searchSuggestionsLoadingAtom, true);
    console.log('Search suggestions');

    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        set(searchSuggestionsAtom, []);
        return;
      }

      const response = await api.get(`bookings/search/suggestions?includes=${encodeURIComponent(searchTerm.trim())}&limit=15`);
      console.log('Search suggestions response:', response.data);
      set(searchSuggestionsAtom, response.data);
    } catch (error: any) {
      console.error('Error fetching search suggestions:', error);
      set(apartmentErrorsAtom, {
        ...get(apartmentErrorsAtom),
        fetchSearchSuggestions: error.message
      });
    } finally {
      set(searchSuggestionsLoadingAtom, false);
    }
  }
);