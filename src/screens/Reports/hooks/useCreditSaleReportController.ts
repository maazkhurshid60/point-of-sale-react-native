import { useEffect } from 'react';
import { useReportStore } from '../../../store/useReportStore';
import { useUIStore } from '../../../store/useUIStore';

export const useCreditSaleReportController = () => {
    const store = useReportStore();
    const setScreen = useUIStore((state) => state.setScreen);
    const filters = store.reports['CREDIT_SALE'];
    const isLoading = store.isLoading['CREDIT_SALE'];

    useEffect(() => {
        store.fetchReportData('CREDIT_SALE');
    }, []);

    const dummyData = [
        { label: '30 Days', value: 4500 },
        { label: '60 Days', value: 2800 },
        { label: '90 Days', value: 1200 },
        { label: 'Over 90', value: 800 }
    ];

    const toggleTabs = (charts: boolean, summary: boolean) => {
        store.toggleTabs('CREDIT_SALE', charts, summary);
    };

    return {
        filters,
        isLoading,
        dummyData,
        setScreen,
        toggleTabs,
    };
};
