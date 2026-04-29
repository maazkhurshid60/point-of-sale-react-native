import { useEffect } from 'react';
import { useReportStore } from '../../../store/useReportStore';
import { useUIStore } from '../../../store/useUIStore';

export const useProductReportController = () => {
  const store = useReportStore();
  const setScreen = useUIStore((state) => state.setScreen);
  
  const filters = store.reports['PRODUCT'];
  const isLoading = store.isLoading['PRODUCT'];

  useEffect(() => {
    store.fetchReportData('PRODUCT');
  }, []);

  const dummySalesData = [
    { label: 'Jan', value: 35 },
    { label: 'Feb', value: 28 },
    { label: 'Mar', value: 34 },
    { label: 'Apr', value: 32 },
    { label: 'May', value: 40 }
  ];

  const toggleTabs = (charts: boolean, summary: boolean) => {
    store.toggleTabs('PRODUCT', charts, summary);
  };

  return {
    filters,
    isLoading,
    dummySalesData,
    setScreen,
    toggleTabs,
  };
};
