import { useEffect } from 'react';
import { useReportStore } from '../../../store/useReportStore';
import { useUIStore } from '../../../store/useUIStore';

export const useInvoicePaymentReportController = () => {
  const store = useReportStore();
  const setScreen = useUIStore((state) => state.setScreen);
  const filters = store.reports['INVOICE'];
  const isLoading = store.isLoading['INVOICE'];

  useEffect(() => {
    store.fetchReportData('INVOICE');
  }, []);

  const dummyData = [
    { label: 'Mon', value: 450 },
    { label: 'Tue', value: 320 },
    { label: 'Wed', value: 580 },
    { label: 'Thu', value: 410 },
    { label: 'Fri', value: 720 }
  ];

  const toggleTabs = (charts: boolean, summary: boolean) => {
    store.toggleTabs('INVOICE', charts, summary);
  };

  return {
    filters,
    isLoading,
    dummyData,
    setScreen,
    toggleTabs,
  };
};
