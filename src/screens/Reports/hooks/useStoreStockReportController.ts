import { useEffect } from 'react';
import { useReportStore } from '../../../store/useReportStore';
import { useUIStore } from '../../../store/useUIStore';

export const useStoreStockReportController = () => {
    const store = useReportStore();
    const setScreen = useUIStore((state) => state.setScreen);
    const filters = store.reports['STORE'];
    const isLoading = store.isLoading['STORE'];

    useEffect(() => {
        store.fetchReportData('STORE');
    }, []);

    const dummyData = [
        { label: 'Store A', value: 850 },
        { label: 'Store B', value: 620 },
        { label: 'Store C', value: 940 },
        { label: 'Store D', value: 1100 }
    ];

    const toggleTabs = (charts: boolean, summary: boolean) => {
        store.toggleTabs('STORE', charts, summary);
    };

    return {
        filters,
        isLoading,
        dummyData,
        setScreen,
        toggleTabs,
    };
};
