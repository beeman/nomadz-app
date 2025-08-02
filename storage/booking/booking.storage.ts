import { atom } from 'jotai';
import { api } from '../../utils/api';
import { ApartmentGuests } from '../../types/booking.types';
import { userOrdersAtom } from './order.storage';
import { NOTIFICATION_MESSAGES } from '../../constants/notifications.constants';
import { HttpStatusCode } from 'axios';
import { authenticatedUserAtom } from '../auth.storage';
import { fetchQuestByTagAtom, accomplishQuestAtom, userQuestsAtom } from '../quests.storage';
import { notificationsAtom } from '../notification.storage';

// Define atoms for storing data
export const bookingDataAtom = atom<any>(null);
export const bookingLoadingAtom = atom<boolean>(false);

// Define atoms for storing errors
export const bookingErrorsAtom = atom({
  preBook: null,
  initialize: null,
  finish: null,
  cancel: null,
});

// Atom to get pre-book data
export const preBookAtom = atom(
  (get) => get(bookingDataAtom),
  async (get, set, hash: string) => {
    set(bookingErrorsAtom, { ...get(bookingErrorsAtom), preBook: null });
    set(bookingLoadingAtom, true);

    try {
      const response = await api.get(`bookings/prebook/${hash}`);
      set(bookingDataAtom, response.data);
      console.log('Pre-book successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Pre-book failed:', error);
      set(bookingErrorsAtom, { ...get(bookingErrorsAtom), preBook: error });
      throw error;
    } finally {
      set(bookingLoadingAtom, false);
    }
  }
);

// Atom to initialize booking
export const initializeBookingAtom = atom(
  null,
  async (get, set, { hid, hash }: { hid: number; hash: string }) => {
    set(bookingErrorsAtom, { ...get(bookingErrorsAtom), initialize: null });
    set(bookingLoadingAtom, true);

    try {
      const response = await api.post('bookings/initialize', { hid, hash });
      console.log('Booking initialization successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Booking initialization failed:', error);
      set(bookingErrorsAtom, { ...get(bookingErrorsAtom), initialize: error });
      throw error;
    } finally {
      set(bookingLoadingAtom, false);
    }
  }
);

// Atom to finish booking
export const finishBookingAtom = atom(
  null,
  async (get, set, params: {
    orderId: string;
    upsellData: any[];
    payment: any;
    paymentType: any;
    guests: ApartmentGuests;
  }) => {
    set(bookingErrorsAtom, { ...get(bookingErrorsAtom), finish: null });
    set(bookingLoadingAtom, true);

    let formattedGuests;
    if (params.guests.guestsDetails && params.guests.guestsDetails.length > 0) {
      formattedGuests = params.guests.guestsDetails;
    } else {
      formattedGuests = [
        ...Array(params.guests.adults).fill(null).map(() => ({
          first_name: 'Guest',
          last_name: 'Adult',
          // is_child: false,
          // age: 18,
          // gender: 'Male',
        })),
        ...params.guests.children.map((age) => ({
          first_name: 'Guest',
          last_name: 'Child',
          // is_child: true,
          // age,
          // gender: 'Male',
        }))
      ];
    }

    const requestBody = {
      orderId: params.orderId,
      upsell_data: params.upsellData,
      payment: params.payment,
      payment_type: {
        type: params.paymentType?.type,
        amount: params.paymentType?.amount,
        currency_code: params.paymentType?.currency_code,
      },
      rooms: [{
        guests: formattedGuests
      }]
    };

    try {
      const response = await api.post('bookings/finish', requestBody);
      console.log('Booking finish successful:', response.data);

      if (response.status === HttpStatusCode.Created) {
        // Create booking confirmation notification
        const userId = get(authenticatedUserAtom)?.id;
        if (userId) {
          const notificationResponse = await api.post(`users/${userId}/notifications`, {
            content: NOTIFICATION_MESSAGES.BOOKING.CONFIRMED(response.data.id),
          });
          // Add new notification to notificationsAtom
          const currentNotifications = get(notificationsAtom);
          set(notificationsAtom, [...currentNotifications, notificationResponse.data]);

          // Fetch quest with "first_booking" tag
          const quest = await set(fetchQuestByTagAtom, 'first_booking');
          if (quest?.id) {
            // Check if the quest is already accomplished
            let userQuests = get(userQuestsAtom);
            if (!userQuests.some(userQuest => userQuest.questId === quest.id)) {
              // Fetch user quests if not found locally
              const userQuestsResponse = await api.get(`users/${userId}/quests`);
              userQuests = userQuestsResponse.data;

              console.log({
                userQuests,
                quest
              })

              // If still not found, accomplish the quest
              if (!userQuests.some(userQuest => userQuest.questId === quest.id)) {
                await set(accomplishQuestAtom, quest.id);
              }
            }
          }
        }
        return response.data;
      }
    } catch (error) {
      console.error('Booking finish failed:', (error as any).message);
      set(bookingErrorsAtom, { ...get(bookingErrorsAtom), finish: error as any });
      throw error;
    } finally {
      set(bookingLoadingAtom, false);
    }
  }
);

export const cancelBookingAtom = atom(
  null,
  async (get, set, orderId: string) => {
    set(bookingErrorsAtom, { ...get(bookingErrorsAtom), cancel: null });
    set(bookingLoadingAtom, true);

    try {
      const response = await api.delete(`bookings/cancel/${orderId}`);
      console.log('Booking cancellation successful:', response.data);

      // Update the order with the new data from response
      const currentOrders = get(userOrdersAtom);
      set(userOrdersAtom, currentOrders.map(order =>
        order.id === orderId ? response.data : order
      ));

      if (response.status === HttpStatusCode.Ok) {
        // Create cancellation notification
        const userId = get(authenticatedUserAtom)?.id;
        if (userId) {
          await api.post(`users/${userId}/notifications`, {
            content: NOTIFICATION_MESSAGES.BOOKING.CANCELLED(orderId)
          });
        }
      }
      return response.data;
    } catch (error) {
      console.error('Booking cancellation failed:', error as any);
      set(bookingErrorsAtom, { ...get(bookingErrorsAtom), cancel: error as any });
      throw error;
    } finally {
      set(bookingLoadingAtom, false);
    }
  }
);
