import { atom } from 'jotai';
import { api } from '../utils/api';
import { BugReport, BugReportAttachment } from '../types/bug-report.types';
import { resolveUrl } from '../utils/app.utils';

// Atoms for storing bug reports data
export const bugReportsAtom = atom<BugReport[]>([]);
export const selectedBugReportAtom = atom<BugReport | null>(null);
export const bugReportAttachmentsAtom = atom<BugReportAttachment[]>([]);
export const bugReportsLoadingAtom = atom<boolean>(false);
export const bugReportErrorsAtom = atom<string | null>(null);

// Fetch all bug reports
export const fetchBugReportsAtom = atom(
  get => get(bugReportsAtom),
  async (get, set, { page = 1, ITEMS_PER_PAGE = 10, queryParams = {} } = {}) => {
    set(bugReportsLoadingAtom, true);
    set(bugReportErrorsAtom, null);

    try {
      const response = await api.get('bug-reports/list', {
        params: {
          take: ITEMS_PER_PAGE,
          skip: (page - 1) * ITEMS_PER_PAGE,
          ...queryParams,
        },
      });
      set(bugReportsAtom, response.data);
    } catch (error: any) {
      set(bugReportErrorsAtom, error.message);
    } finally {
      set(bugReportsLoadingAtom, false);
    }
  },
);

// Fetch single bug report
export const fetchBugReportAtom = atom(
  get => get(selectedBugReportAtom),
  async (get, set, bugReportId: string) => {
    set(selectedBugReportAtom, null);
    set(bugReportsLoadingAtom, true);
    set(bugReportErrorsAtom, null);

    try {
      const url = resolveUrl(`bug-reports/my/${bugReportId}`);
      const response = await api.get(url);
      set(selectedBugReportAtom, response.data);
    } catch (error: any) {
      set(bugReportErrorsAtom, error.message);
    } finally {
      set(bugReportsLoadingAtom, false);
    }
  },
);

// Create new bug report
export const createBugReportAtom = atom(
  null,
  async (get, set, newBugReport: Partial<BugReport> & { attachments?: File[] }) => {
    set(bugReportErrorsAtom, null);

    try {
      const formData = new FormData();

      // Add bug report data
      Object.entries(newBugReport).forEach(([key, value]) => {
        if (key !== 'attachments' && value !== undefined) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Add attachments if any
      if (newBugReport.attachments?.length) {
        newBugReport.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const response = await api.post('bug-reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const currentBugReports = get(bugReportsAtom);
      set(bugReportsAtom, [...currentBugReports, response.data]);
      return response.data;
    } catch (error: any) {
      set(bugReportErrorsAtom, error.message);
      throw error;
    }
  },
);

// Update bug report
export const updateBugReportAtom = atom(
  null,
  async (get, set, { id, data }: { id: string; data: Partial<BugReport> }) => {
    set(bugReportErrorsAtom, null);

    try {
      const response = await api.put(`bug-reports/${id}`, data);
      const currentBugReports = get(bugReportsAtom);
      set(
        bugReportsAtom,
        currentBugReports.map(report => (report.id === id ? response.data : report)),
      );
      return response.data;
    } catch (error: any) {
      set(bugReportErrorsAtom, error.message);
      throw error;
    }
  },
);

// Delete bug report
export const deleteBugReportAtom = atom(null, async (get, set, id: string) => {
  set(bugReportErrorsAtom, null);

  try {
    await api.delete(`bug-reports/${id}`);
    const currentBugReports = get(bugReportsAtom);
    set(
      bugReportsAtom,
      currentBugReports.filter(report => report.id !== id),
    );
  } catch (error: any) {
    set(bugReportErrorsAtom, error.message);
    throw error;
  }
});

// Fetch bug report attachments
export const fetchBugReportAttachmentsAtom = atom(
  get => get(bugReportAttachmentsAtom),
  async (get, set, bugReportId: string) => {
    set(bugReportsLoadingAtom, true);
    set(bugReportErrorsAtom, null);

    try {
      const response = await api.get(`bug-reports/${bugReportId}/attachments`);
      set(bugReportAttachmentsAtom, response.data);
    } catch (error: any) {
      set(bugReportErrorsAtom, error.message);
    } finally {
      set(bugReportsLoadingAtom, false);
    }
  },
);
