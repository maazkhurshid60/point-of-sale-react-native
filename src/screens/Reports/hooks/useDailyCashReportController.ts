import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useShiftStore } from '../../../store/useShiftStore';
import { useUIStore } from '../../../store/useUIStore';

export const useDailyCashReportController = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const setScreen = useUIStore((state) => state.setScreen);

  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('summary');

  const fetchDailyCashReports = useShiftStore((state) => state.fetchDailyCashReports);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchDailyCashReports();
    setReportData(data);
    setIsLoading(false);
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: 'file-invoice-dollar' },
    { id: 'bank', label: 'Bank', icon: 'building-columns' },
    { id: 'cash', label: 'Cash', icon: 'money-bill-1' },
    { id: 'return', label: 'Return', icon: 'arrow-rotate-left' },
    { id: 'supplier', label: 'Supplier', icon: 'truck-field' },
    { id: 'division', label: 'Division', icon: 'layer-group' },
  ];

  return {
    isTablet,
    isLoading,
    reportData,
    activeTab,
    tabs,
    setScreen,
    setActiveTab,
    loadData,
  };
};
