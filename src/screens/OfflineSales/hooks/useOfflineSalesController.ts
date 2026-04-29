import { useState } from 'react';
import { useWindowDimensions, Alert } from 'react-native';
import { useOfflineSalesStore, OfflineSale } from '../../../store/useOfflineSalesStore';
import { useAuthStore } from '../../../store/useAuthStore';

const EMPTY_ARRAY: any[] = [];

export const useOfflineSalesController = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const sales = useOfflineSalesStore((state) => state.sales);
  const removeOfflineSale = useOfflineSalesStore((state) => state.removeOfflineSale);
  const clearAllSales = useOfflineSalesStore((state) => state.clearAllSales);
  const customers = useAuthStore((state) => state.currentUser?.customers || EMPTY_ARRAY);

  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const OFFLINE_LIMIT = 1000;
  const usedPercentage = (sales.length / OFFLINE_LIMIT) * 100;

  const handleDeleteAll = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete all offline sales? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => clearAllSales()
        }
      ]
    );
  };

  const syncSale = async (sale: OfflineSale) => {
    setIsLoading(true);
    // Placeholder for actual sync logic to the server
    setTimeout(() => {
      Alert.alert("Sync Successful", "Sale has been synchronized with the server.");
      removeOfflineSale(sale.sale_id);
      setIsLoading(false);
    }, 1500);
  };

  const toggleExpand = (id: string) => {
    setExpandedSaleId(prev => (prev === id ? null : id));
  };

  return {
    isTablet,
    sales,
    customers,
    expandedSaleId,
    isLoading,
    OFFLINE_LIMIT,
    usedPercentage,
    handleDeleteAll,
    syncSale,
    removeOfflineSale,
    toggleExpand,
  };
};
