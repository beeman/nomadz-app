import { atom } from 'jotai';
import { api } from '../utils/api';
import { authenticatedUserAtom } from './auth.storage';
import { Notification, NotificationStatuses } from '../types/notification.types';
import { ActionCreatorOptions } from '../types/action.types';

// Atoms for storing notifications data
export const notificationsAtom = atom<Notification[]>([]);
export const notificationsLoadingAtom = atom<boolean>(false);
export const notificationsErrorAtom = atom<string | null>(null);

// Atom for unread count
export const unreadCountAtom = atom((get) => 
  get(notificationsAtom).filter(n => n.status === NotificationStatuses.Unread).length
);

// Atom to fetch user notifications
export const fetchNotificationsAtom = atom(
  (get) => get(notificationsAtom),
  async (get, set, options?: ActionCreatorOptions) => {
    const userId = get(authenticatedUserAtom)?.id;

    if (!userId) {
      set(notificationsErrorAtom, 'User not authenticated');
      return;
    }

    set(notificationsLoadingAtom, true);
    set(notificationsErrorAtom, null);

    try {
      const response = await api.get(`users/${userId}/notifications`);
      set(notificationsAtom, response.data);
      options?.onSuccess?.(response.data);
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      set(notificationsErrorAtom, error.message);
      options?.onError?.(error);
    } finally {
      set(notificationsLoadingAtom, false);
    }
  }
);

// Atom to create a notification
export const createNotificationAtom = atom(
  null,
  async (get, set, content: string, options?: ActionCreatorOptions) => {
    const userId = get(authenticatedUserAtom)?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await api.post(`users/${userId}/notifications`, { content });
      const currentNotifications = get(notificationsAtom);
      set(notificationsAtom, [...currentNotifications, response.data]);
      options?.onSuccess?.(response.data);
    } catch (error: any) {
      options?.onError?.(error);
      throw error;
    }
  }
);

// Atom to update a notification (e.g., mark as read)
export const updateNotificationAtom = atom(
  null,
  async (get, set, notificationId: string, data: Partial<Notification>, options?: ActionCreatorOptions) => {
    try {
      const response = await api.put(`notifications/${notificationId}`, data);
      const currentNotifications = get(notificationsAtom);
      const updatedNotifications = currentNotifications.map(notification =>
        notification.id === notificationId ? { ...notification, ...response.data } : notification
      );
      set(notificationsAtom, updatedNotifications);
      options?.onSuccess?.(response.data);
    } catch (error: any) {
      options?.onError?.(error);
      throw error;
    }
  }
); 