import { useContext } from 'react';
import { ReportsContext } from '../contexts/ReportsContext';

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (ctx === undefined) {
    throw new Error('useReports must be used within a <ReportsProvider>');
  }
  return ctx;
}
