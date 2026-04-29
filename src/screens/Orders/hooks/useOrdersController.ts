import { useState, useCallback } from 'react';
import { useWindowDimensions, Alert, DimensionValue } from 'react-native';
import { useOrders, useDeleteOrder } from '../../../api/catalog/queries';

export const useOrdersController = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  const isLandscape = height < width;
  const isLargeTablet = width > 1024;

  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdownRow, setActiveDropdownRow] = useState<number | null>(null);

  const { data: ordersData, isLoading, refetch, isFetching } = useOrders(currentPage);
  const { mutateAsync: deleteOrder } = useDeleteOrder();

  const orders = ordersData?.data || [];
  const totalRecords = ordersData?.total || 0;
  const hasNextPage = !!ordersData?.next_page_url;
  const hasPrevPage = !!ordersData?.prev_page_url;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleAction = async (action: 'Delete' | 'Sale' | 'Purchase', order: any) => {
    setActiveDropdownRow(null);

    if (action === 'Delete') {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this order?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteOrder(order.id);
                Alert.alert('Success', 'Order deleted successfully');
              } catch (err) {
                Alert.alert('Error', 'Failed to delete order');
              }
            }
          }
        ]
      );
    } else {
      Alert.alert('Notice', `${action === 'Sale' ? 'Convert to Sale' : 'Convert to Purchase'} logic coming soon.`);
    }
  };

  const contentMaxWidth: DimensionValue = isLargeTablet ? 1200 : isTablet ? 1000 : '100%';

  return {
    // State
    isTablet,
    isLandscape,
    isLargeTablet,
    contentMaxWidth,
    orders,
    isLoading: isLoading || isFetching,
    activeDropdownRow,
    pagination: {
      currentPage,
      totalRecords,
      hasNextPage,
      hasPrevPage,
    },

    // Actions
    setActiveDropdownRow,
    handlePageChange,
    onRefresh,
    handleAction,
  };
};
