import { useEffect } from 'react';
import { useReportStore } from '../../../store/useReportStore';
import { useUIStore } from '../../../store/useUIStore';

export const useWarehouseStockReportController = () => {
    const store = useReportStore();
    const setScreen = useUIStore((state) => state.setScreen);
    const filters = store.reports['WAREHOUSE'];
    const isLoading = store.isLoading['WAREHOUSE'];

    useEffect(() => {
        store.fetchReportData('WAREHOUSE');
    }, []);

    const dummyData = [
        { label: 'Electronics', value: 450 },
        { label: 'Clothing', value: 1200 },
        { label: 'Food', value: 800 },
        { label: 'Hardware', value: 300 }
    ];

    const toggleTabs = (charts: boolean, summary: boolean) => {
        store.toggleTabs('WAREHOUSE', charts, summary);
    };

    return {
        filters,
        isLoading,
        dummyData,
        setScreen,
        toggleTabs,
    };
};
