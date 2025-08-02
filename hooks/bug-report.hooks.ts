import { useAtom } from 'jotai';
import {
  fetchBugReportsAtom,
  fetchBugReportAtom,
  createBugReportAtom,
  updateBugReportAtom,
  deleteBugReportAtom,
  fetchBugReportAttachmentsAtom,
  bugReportsLoadingAtom,
  bugReportErrorsAtom,
} from '../storage/bug-report.storage';
import { BugReport } from '../types/bug-report.types';

export const useBugReports = () => {
  const [bugReports, fetchBugReports] = useAtom(fetchBugReportsAtom);
  const [selectedBugReport, fetchBugReport] = useAtom(fetchBugReportAtom);
  const [, createBugReport] = useAtom(createBugReportAtom);
  const [, updateBugReport] = useAtom(updateBugReportAtom);
  const [, deleteBugReport] = useAtom(deleteBugReportAtom);
  const [attachments, fetchAttachments] = useAtom(fetchBugReportAttachmentsAtom);
  const [isLoading] = useAtom(bugReportsLoadingAtom);
  const [errors] = useAtom(bugReportErrorsAtom);

  const submitBugReport = async (data: Partial<BugReport> & { attachments?: File[] }) => {
    try {
      return await createBugReport(data);
    } catch (error) {
      throw error;
    }
  };

  const editBugReport = async (id: string, data: Partial<BugReport>) => {
    try {
      return await updateBugReport({ id, data });
    } catch (error) {
      throw error;
    }
  };

  const removeBugReport = async (id: string) => {
    try {
      await deleteBugReport(id);
    } catch (error) {
      throw error;
    }
  };

  return {
    bugReports,
    selectedBugReport,
    attachments,
    isLoading,
    errors,
    fetchBugReports,
    fetchBugReport,
    submitBugReport,
    editBugReport,
    removeBugReport,
    fetchAttachments
  };
}; 