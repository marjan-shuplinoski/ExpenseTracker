import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchSummaryReport, fetchMonthlyReport, fetchYearlyReport, SummaryReport, MonthlyReportItem, YearlyReportItem } from '../services/reportsService';

interface ReportsState {
  summary: SummaryReport | null;
  monthly: MonthlyReportItem[];
  yearly: YearlyReportItem[];
  loading: boolean;
  error: string | null;
  getSummary: () => Promise<void>;
  getMonthly: () => Promise<void>;
  getYearly: () => Promise<void>;
}

export const ReportsContext = createContext<ReportsState | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [summary, setSummary] = useState<SummaryReport | null>(null);
  const [monthly, setMonthly] = useState<MonthlyReportItem[]>([]);
  const [yearly, setYearly] = useState<YearlyReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSummaryReport();
      setSummary(data);
    } catch {
      setError('Failed to fetch summary report.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getMonthly = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMonthlyReport();
      setMonthly(data);
    } catch {
      setError('Failed to fetch monthly report.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getYearly = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchYearlyReport();
      setYearly(data);
    } catch {
      setError('Failed to fetch yearly report.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ReportsContext.Provider value={{ summary, monthly, yearly, loading, error, getSummary, getMonthly, getYearly }}>
      {children}
    </ReportsContext.Provider>
  );
};

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within ReportsProvider');
  return ctx;
}
