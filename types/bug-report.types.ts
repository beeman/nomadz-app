import { User } from './user.types';

export enum BugReportCategories {
  GamificationIssues = 'GamificationIssues',
  BookingProblems = 'BookingProblems',
  PropertyListingErrors = 'PropertyListingErrors',
  SearchAndFilters = 'SearchAndFilters',
  PerfomanceIssues = 'PerfomanceIssues',
  AccountAndProfile = 'AccountAndProfile',
  Other = 'Other'
}

export enum BugReportStatuses {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum BugReportSeverities {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export interface BugReport {
  id: string;
  authorId: string;
  title: string;
  details: string;
  isNotificationRequested: boolean;
  severity: BugReportSeverities;
  category: BugReportCategories;
  status: BugReportStatuses;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
  attachments?: BugReportAttachment[];
}

export interface BugReportAttachment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  bugReportId: string;
  location: string;
  filename: string | null;
} 