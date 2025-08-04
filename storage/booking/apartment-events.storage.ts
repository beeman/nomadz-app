import { atom } from 'jotai';
import { api } from '../../utils/api';
import { authenticatedUserAtom } from '../auth.storage';
import { UserToHotel } from '../../types/userToHotel.types';

// Atoms for storing apartment events data
export const apartmentEventsAtom = atom<UserToHotel[]>([]);
export const apartmentEventsLoadingAtom = atom<boolean>(false);
export const apartmentEventsErrorAtom = atom<string | null>(null);

// Atom to fetch apartment events
export const fetchApartmentEventsAtom = atom(
  null,
  async (get, set) => {
    const userId = get(authenticatedUserAtom)?.id;

    if (!userId) {
      set(apartmentEventsErrorAtom, 'User not authenticated');
      return;
    }

    set(apartmentEventsLoadingAtom, true);
    set(apartmentEventsErrorAtom, null);

    try {
      const response = await api.get<UserToHotel[]>(`users/${userId}/listings/hotels`);
      set(apartmentEventsAtom, response.data);
      return response.data;
    } catch (error: any) {
      set(apartmentEventsErrorAtom, error.message);
      throw error;
    } finally {
      set(apartmentEventsLoadingAtom, false);
    }
  }
);

// Atom to update apartment event
export const updateApartmentEventAtom = atom(
  null,
  async (get, set, { hid, type, value }: { hid: number; type: string; value: boolean }) => {
    const userId = get(authenticatedUserAtom)?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    set(apartmentEventsLoadingAtom, true);
    set(apartmentEventsErrorAtom, null);

    try {
      await api.post<UserToHotel>(`users/${userId}/listings/hotels`, {
        hid,
        [type]: value
      });

      // Fetch updated data
      const response = await api.get<UserToHotel[]>(`users/${userId}/listings/hotels`);
      set(apartmentEventsAtom, response.data);
      return response.data;
    } catch (error: any) {
      set(apartmentEventsErrorAtom, error.message);
      throw error;
    } finally {
      set(apartmentEventsLoadingAtom, false);
    }
  }
); 