export enum NotificationStatuses {
  Read = 'Read',
  Unread = 'Unread'
}

export type Notification = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  content: string;
  status: NotificationStatuses;
} 