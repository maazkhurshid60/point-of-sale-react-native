import { useEffect } from 'react';
import { useReportStore } from '../../../store/useReportStore';
import { useUIStore } from '../../../store/useUIStore';

export const useCashierReportController = () => {
    const store = useReportStore();
    const setScreen = useUIStore((state) => state.setScreen);
    const filters = store.reports['CASHIER'];
    const isLoading = store.isLoading['CASHIER'];

    useEffect(() => {
        store.fetchReportData('CASHIER');
    }, []);

    const dummyData = [
        { label: 'John', value: 1200 },
        { label: 'Sara', value: 950 },
        { label: 'Mike', value: 1400 },
        { label: 'Emma', value: 1100 }
    ];

    const toggleTabs = (charts: boolean, summary: boolean) => {
        store.toggleTabs('CASHIER', charts, summary);
    };

    return {
        filters,
        isLoading,
        dummyData,
        setScreen,
        toggleTabs,
    };
};
