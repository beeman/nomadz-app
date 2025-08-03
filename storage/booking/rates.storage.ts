import { atom } from 'jotai';
import { api } from '../../utils/api';
import { resolveUrl } from '../../utils/app.utils';
import { authenticatedUserAtom } from '../auth.storage';
import { prepareRequestParams } from '../../utils/params.utils';
import { getPriceWithCommission } from '../../utils/rate.utils';

// Atoms for storing rates data
export const selectedApartmentRatesAtom = atom<any>(null);
export const selectedApartmentRatesLoadingAtom = atom<boolean>(false);

// Helper function to add commission to rates for display purposes
const addCommissionToRates = (ratesData: any): any => {
  if (!ratesData || !ratesData.rates) {
    return ratesData;
  }

  return {
    ...ratesData,
    rates: ratesData.rates.map((rate: any) => {
      if (!rate.payment_options?.payment_types?.[0]) {
        return rate;
      }

      const paymentType = rate.payment_options.payment_types[0];

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
};

// Atom to fetch rates of a single apartment
export const fetchApartmentRatesAtom = atom(
  (get) => get(selectedApartmentRatesAtom),
  async (get, set, { hid, params }: { hid: string, params?: any }) => {
    const authenticatedUser = get(authenticatedUserAtom);
    set(selectedApartmentRatesLoadingAtom, true);
    try {
      const preparedParams = prepareRequestParams(
        params || {},
        authenticatedUser?.userProfile
      );

      const url = resolveUrl(`bookings/apartments/${hid}/rates`, preparedParams);
      const response = await api.get(url);

      // Add commission to rates for display purposes
      const ratesWithCommission = addCommissionToRates(response.data);
      set(selectedApartmentRatesAtom, ratesWithCommission);
    }
    catch {
      set(selectedApartmentRatesAtom, null)
    }
    finally {
      set(selectedApartmentRatesLoadingAtom, false);
    }
  }
); 