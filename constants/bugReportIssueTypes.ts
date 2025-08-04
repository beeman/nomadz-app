import { BugReportCategories } from '../types/bug-report.types';
import { BugIcon, GamepadIcon, HomeIcon, SearchIcon, UserInlineIcon, QuestionMarkCircleIcon } from '../components/icons/Icons';

export const BUG_REPORT_ISSUE_TYPES = [
  { key: BugReportCategories.GamificationIssues, label: 'Gamification Issues', icon: GamepadIcon },
  { key: BugReportCategories.BookingProblems, label: 'Booking Problems', icon: HomeIcon },
  { key: BugReportCategories.PropertyListingErrors, label: 'Property Listing Errors', icon: HomeIcon },
  { key: BugReportCategories.SearchAndFilters, label: 'Search & Filters', icon: SearchIcon },
  { key: BugReportCategories.PerfomanceIssues, label: 'Performance Issues', icon: BugIcon },
  { key: BugReportCategories.AccountAndProfile, label: 'Account and profile', icon: UserInlineIcon },
  { key: BugReportCategories.Other, label: 'Other', icon: QuestionMarkCircleIcon },
]; 