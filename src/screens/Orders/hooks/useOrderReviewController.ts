import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useUIStore } from '../../../store/useUIStore';
import { useKitchenOrdersQuery, useUpdateKitchenStatusMutation, useUpdateKitchenItemStatusMutation } from '../../../api/kitchen/queries';
import { KitchenOrder } from '../../../models';

export type KitchenViewType = 'All' | 'ToDo' | 'InProgress' | 'Done';

export const useOrderReviewController = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const setScreen = useUIStore((state) => state.setScreen);

  const [activeView, setActiveView] = useState<KitchenViewType>('All');
  const [selectedWaiter, setSelectedWaiter] = useState('All');

  // API Integration
  const { data: orders = [], isLoading, refetch, isRefetching } = useKitchenOrdersQuery();
  const updateStatusMutation = useUpdateKitchenStatusMutation();
  const updateItemMutation = useUpdateKitchenItemStatusMutation();

  const filteredOrders = orders.filter((order) => {
    const waiterMatch = selectedWaiter === 'All' || order.waiterName === selectedWaiter;
    if (activeView === 'All') return waiterMatch;
    if (activeView === 'ToDo') return order.status === 'pending' && waiterMatch;
    if (activeView === 'InProgress') return order.status === 'accepted' && waiterMatch;
    if (activeView === 'Done') return order.status === 'done' && waiterMatch;
    return waiterMatch;
  });

  const todoOrders = orders.filter(o => o.status === 'pending');
  const inProgressOrders = orders.filter(o => o.status === 'accepted');
  const doneOrders = orders.filter(o => o.status === 'done');

  const waiters = ['All', ...new Set(orders.map(o => o.waiterName))];

  const handleStatusChange = (orderId: number, status: KitchenOrder['status']) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const handleItemStatusChange = (orderId: number, productId: number, status: any) => {
    updateItemMutation.mutate({ orderId, productId, status });
  };

  return {
    isTablet,
    setScreen,
    activeView,
    setActiveView,
    selectedWaiter,
    setSelectedWaiter,
    orders,
    isLoading,
    refetch,
    isRefetching,
    filteredOrders,
    todoOrders,
    inProgressOrders,
    doneOrders,
    waiters,
    handleStatusChange,
    handleItemStatusChange,
  };
};
