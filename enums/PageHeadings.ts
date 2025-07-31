import { RoutePaths } from './RoutePaths';

export const PageHeadings: { [key in RoutePaths]?: string } & { [key: string]: string } = {
  [RoutePaths.EVENTS]: 'events',
  [RoutePaths.ABOUT]: 'about',
  [RoutePaths.PROFILE]: 'profile',
  [RoutePaths.BADGES]: 'badges',
  [RoutePaths.LEADERBOARD]: 'leaderboard',
  [RoutePaths.COMMUNITIES]: 'communities',
  [RoutePaths.SAVED]: 'saved',
  [RoutePaths.SETTINGS]: 'settings',
  [RoutePaths.PROPERTY]: 'property',
  [RoutePaths.TRIPS]: 'trips',
  [RoutePaths.NOTIFICATIONS]: 'notifications',
  [RoutePaths.CHAT]: 'chat',
  [RoutePaths.CHATS]: 'chats',
  [RoutePaths.ACHIEVEMENTS]: 'achievements',
  [RoutePaths.USER_PROFILE]: 'profile',
  '/user': 'profile',
  [RoutePaths.SETTINGS_SECURITY]: 'security',
  [RoutePaths.SETTINGS_PROFILE]: 'profile',
  [RoutePaths.SETTINGS_PAYMENTS]: 'payment',
};
