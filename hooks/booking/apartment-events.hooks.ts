import { useAtom, useAtomValue } from 'jotai';
import {
  apartmentEventsAtom,
  fetchApartmentEventsAtom,
  updateApartmentEventAtom,
  apartmentEventsLoadingAtom,
  apartmentEventsErrorAtom,
} from '../../storage/booking/apartment-events.storage';

export const useApartmentEvents = () => {
  const [events] = useAtom(apartmentEventsAtom);
  const [, fetchEvents] = useAtom(fetchApartmentEventsAtom);
  const [, updateEvent] = useAtom(updateApartmentEventAtom);
  const isLoading = useAtomValue(apartmentEventsLoadingAtom);
  const error = useAtomValue(apartmentEventsErrorAtom);

  // Helper function for save events
  const toggleSaveApartment = async (hid: number, value?: boolean) => {
    const event = events.find(event => event.hid === hid);
    return updateEvent({
      hid,
      type: 'isSaved', 
      value: value === undefined ? !event?.isSaved : value,
    });
  };

  return {
    events,
    fetchEvents,
    updateEvent,
    isLoading,
    error,
    toggleSaveApartment,
  };
}; 