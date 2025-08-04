import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import { api } from '../../utils/api';
import { Location } from '../../types/booking.types'

export const selectedLocationAtom = atomWithReset<Location | null>(null);

export const fetchLocationByRegionId = atom(
  null, // read value (not used in this case)
  async (get, set, id: number) => {
    try {
      const response = await api.get<Location>(`bookings/cities/${id}`);
      set(selectedLocationAtom, response.data);
    } catch (error) {
      console.error('Error fetching location:', error);
      set(selectedLocationAtom, null);
    }
  }
); 