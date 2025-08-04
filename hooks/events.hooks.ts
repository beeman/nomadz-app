import { useAtom } from 'jotai';
import { fetchCachedEventsAtom, fetchEventsAtom, fetchEventAtom} from '../storage/events.storage';

export const useEvents = () => {
  const [events, fetchEvents] = useAtom(fetchEventsAtom);
  const [cachedEvents, fetchCachedEvents] = useAtom(fetchCachedEventsAtom);
  const [selectedEvent, fetchEventById] = useAtom(fetchEventAtom);

  return {
    events,
    cachedEvents,
    selectedEvent,
    fetchEvents,
    fetchCachedEvents,
    fetchEventById,
  };
};
