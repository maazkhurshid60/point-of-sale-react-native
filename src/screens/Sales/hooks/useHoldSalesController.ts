import { useEffect, useState } from 'react';
import { Alert, useWindowDimensions } from 'react-native';
import { useCartStore } from '../../../store/useCartStore';
import { useUIStore } from '../../../store/useUIStore';
import { HoldSaleModel } from '../../../models';

export const useHoldSalesController = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const { holdSales, fetchHoldSales, recallSale, deleteHoldSale, nextPageUrl } = useCartStore();
  const setScreen = useUIStore((state) => state.setScreen);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHoldSales();
  }, []);

  const loadHoldSales = async (url?: string) => {
    setLoading(true);
    await fetchHoldSales(url);
    setLoading(false);
  };

  const handleRecall = (sale: HoldSaleModel) => {
    Alert.alert(
      'Recall Sale',
      'Are you sure you want to recall this sale? The current cart will be replaced.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Recall',
          onPress: async () => {
            const success = await recallSale(sale.sale_id);
            if (success) {
              setScreen('POS_BILLING');
            } else {
              Alert.alert('Error', 'Failed to recall sale');
            }
          }
        },
      ]
    );
  };

  const handleDelete = (saleId: number) => {
    Alert.alert(
      'Delete Hold Sale',
      'Are you sure you want to delete this draft?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteHoldSale(saleId);
            if (!success) {
              Alert.alert('Error', 'Failed to delete sale');
            }
          }
        },
      ]
    );
  };

  return {
    isTablet,
    setScreen,
    holdSales,
    loading,
    nextPageUrl,
    loadHoldSales,
    handleRecall,
    handleDelete,
  };
};
