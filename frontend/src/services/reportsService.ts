import api from './api';

export interface SummaryReport {
  totals: Record<string, number>;
  byCategory: { category: string; type: string; total: number }[];
}

export interface MonthlyReportItem {
  _id: { month: number; year: number; type: string };
  total: number;
}

export interface YearlyReportItem {
  _id: { year: number; type: string };
  total: number;
}

export async function fetchSummaryReport(): Promise<SummaryReport> {
  const res = await api.get('/reports/summary');
  return res.data.data;
}

export async function fetchMonthlyReport(): Promise<MonthlyReportItem[]> {
  const res = await api.get('/reports/monthly');
  return res.data.data;
}

export async function fetchYearlyReport(): Promise<YearlyReportItem[]> {
  const res = await api.get('/reports/yearly');
  return res.data.data;
}
