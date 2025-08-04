import { useAtom, useAtomValue } from 'jotai';
import {
  notificationsLoadingAtom,
  notificationsErrorAtom,
  fetchNotificationsAtom,
  createNotificationAtom,
  updateNotificationAtom,
  unreadCountAtom,
} from '../storage/notification.storage';
import { ActionCreatorOptions } from '../types/action.types';
import type { Notification } from '../types/notification.types';
import { NotificationStatuses } from '../types/notification.types';

export const useNotifications = () => {
  const [notifications, fetchNotifications] = useAtom(fetchNotificationsAtom);
  const isLoading = useAtomValue(notificationsLoadingAtom);
  const error = useAtomValue(notificationsErrorAtom);
  const unreadCount = useAtomValue(unreadCountAtom);
  const [, createNotification] = useAtom(createNotificationAtom);
  const [, updateNotification] = useAtom(updateNotificationAtom);

  const readNotification = (id: string, options?: ActionCreatorOptions) =>
    updateNotification(id, { status: NotificationStatuses.Read }, options);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    createNotification: (content: string, options?: ActionCreatorOptions) =>
      createNotification(content, options),
    updateNotification: (id: string, data: Partial<Notification>, options?: ActionCreatorOptions) =>
      updateNotification(id, data, options),
    readNotification,
  };
}; 