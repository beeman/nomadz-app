import { useAtom, useAtomValue } from 'jotai';
import {
  preBookAtom,
  initializeBookingAtom,
  finishBookingAtom,
  cancelBookingAtom,
  bookingDataAtom,
  bookingLoadingAtom,
  bookingErrorsAtom
} from '../../storage/booking/booking.storage';

export const useBooking = () => {
  const [bookingData] = useAtom(bookingDataAtom);
  const [, preBook] = useAtom(preBookAtom);
  const [, initializeBooking] = useAtom(initializeBookingAtom);
  const [, finishBooking] = useAtom(finishBookingAtom);
  const [, cancelBooking] = useAtom(cancelBookingAtom);
  const isLoading = useAtomValue(bookingLoadingAtom);
  const errors = useAtomValue(bookingErrorsAtom);

  return {
    bookingData,
    preBook,
    initializeBooking,
    finishBooking,
    cancelBooking,
    isLoading,
    errors
  };
}; 