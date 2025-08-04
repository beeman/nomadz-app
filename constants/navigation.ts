import { RoutePaths } from '../enums/RoutePaths';
import {
  BellIcon,
  GlobeIcon,
  LeaderboardIcon,
  CommunityIcon,
  BookmarkSquareIcon,
  CogIcon,
  UserInlineIcon,
  MagnifyingGlassIcon,
  HouseIcon,
  BugIcon,
  UserPlusIcon,
  SuitcaseIcon,
  MessagesIcon,
  SolanaOutlineIcon,
} from '../components/icons/Icons';
import { CalendarIcon, ClipboardList } from 'lucide-react';
import { TrophyIcon } from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  to: RoutePaths;
  icon: React.ComponentType<{ className?: string }>;
  showInMenu?: boolean;
  showInSidebar?: boolean;
}

export const navigation: NavItem[] = [
  { name: 'profile', to: RoutePaths.PROFILE, icon: UserInlineIcon },
  { name: 'quests', to: RoutePaths.QUESTS, icon: ClipboardList },
  { name: 'messages', to: RoutePaths.CHATS, icon: MessagesIcon },
  { name: 'achievements', to: RoutePaths.ACHIEVEMENTS, icon: TrophyIcon },
  { name: 'leaderboard', to: RoutePaths.LEADERBOARD, icon: LeaderboardIcon },
  { name: 'communities', to: RoutePaths.COMMUNITIES, icon: CommunityIcon },
  { name: 'trips', to: RoutePaths.TRIPS, icon: GlobeIcon, showInMenu: false, showInSidebar: true },
  { name: 'saved', to: RoutePaths.SAVED, icon: BookmarkSquareIcon },
  { name: 'settings', to: RoutePaths.SETTINGS, icon: CogIcon },
];

export const mobileSidebarNavigation: NavItem[] = [
  { name: 'home', to: RoutePaths.HOME, icon: HouseIcon },
  { name: 'events', to: RoutePaths.EVENTS, icon: CalendarIcon },
  { name: 'quests', to: RoutePaths.QUESTS, icon: ClipboardList },
  { name: 'messages', to: RoutePaths.CHATS, icon: MessagesIcon },
  { name: 'achievements', to: RoutePaths.ACHIEVEMENTS, icon: TrophyIcon },
  { name: 'leaderboard', to: RoutePaths.LEADERBOARD, icon: LeaderboardIcon },
  { name: 'saved', to: RoutePaths.SAVED, icon: BookmarkSquareIcon },
  { name: 'settings', to: RoutePaths.SETTINGS, icon: CogIcon },
];

export const menuNavigation: NavItem[] = [
  { name: 'profile', to: RoutePaths.PROFILE, icon: UserInlineIcon },
  { name: 'saved', to: RoutePaths.SAVED, icon: BookmarkSquareIcon },
  { name: 'messages', to: RoutePaths.CHATS, icon: MessagesIcon },
  { name: 'settings', to: RoutePaths.SETTINGS, icon: CogIcon },
  { name: 'bug reports', to: RoutePaths.BUG_REPORTS, icon: BugIcon },
];

export const desktopNavbarNavigation: NavItem[] = [
  { name: 'profile', to: RoutePaths.PROFILE, icon: UserInlineIcon },
  { name: 'achievements', to: RoutePaths.ACHIEVEMENTS, icon: TrophyIcon },
  { name: 'leaderboard', to: RoutePaths.LEADERBOARD, icon: LeaderboardIcon },
  { name: 'quests', to: RoutePaths.QUESTS, icon: ClipboardList },
  { name: 'communities', to: RoutePaths.COMMUNITIES, icon: CommunityIcon },
  { name: 'suitcases', to: RoutePaths.SUITCASES, icon: SuitcaseIcon },
  { name: 'referral program', to: RoutePaths.REFERRAL, icon: UserPlusIcon },
];

export const MOBILE_NAV_ITEMS = [
  {
    name: 'home',
    icon: HouseIcon,
    href: RoutePaths.HOME,
  },
  {
    name: 'stays',
    icon: MagnifyingGlassIcon,
    href: RoutePaths.STAYS,
  },
  {
    name: 'trips',
    icon: GlobeIcon,
    href: RoutePaths.TRIPS,
  },
  {
    name: 'notifications',
    icon: BellIcon,
    href: RoutePaths.NOTIFICATIONS,
  },
  {
    name: 'events',
    icon: SolanaOutlineIcon,
    href: RoutePaths.EVENTS,
  },
  {
    name: 'profile',
    icon: UserInlineIcon,
    href: RoutePaths.PROFILE,
  },
] as const;
