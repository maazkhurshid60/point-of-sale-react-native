import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useUIStore } from '../../store/useUIStore';
import { useKitchenOrdersQuery, useUpdateKitchenStatusMutation, useUpdateKitchenItemStatusMutation } from '../../api/kitchen/queries';
import { KitchenOrderCard } from '../../components/kitchen/KitchenOrderCard';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { KitchenOrder } from '../../models';

type KitchenViewType = 'All' | 'ToDo' | 'InProgress' | 'Done';

export const OrderReviewScreen: React.FC = () => {
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

  const renderOrderList = (list: KitchenOrder[], title: string, color: string) => (
    <View style={styles.column}>
      <View style={[styles.columnHeader, { borderLeftColor: color }]}>
        <Text style={styles.columnTitle}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{list.length}</Text>
        </View>
      </View>
      <FlatList
        data={list}
        keyExtractor={(item) => item.orderId.toString()}
        renderItem={({ item }) => (
          <KitchenOrderCard 
            order={item} 
            onStatusChange={handleStatusChange}
            onItemStatusChange={handleItemStatusChange}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  if (isLoading && orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Fetching Kitchen Orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('DEFAULT')}>
            <FontAwesome6 name="arrow-left" size={18} color="#1E293B" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Kitchen Orders</Text>
            <Text style={styles.subtitle}>{orders.length} Active Tickets</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.refreshBtn} onPress={() => refetch()} disabled={isRefetching}>
          <FontAwesome6 
            name="rotate" 
            size={16} 
            color={COLORS.primary} 
            style={isRefetching && { transform: [{ rotate: '45deg' }] }} 
          />
        </TouchableOpacity>
      </View>

      {/* Filters Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <Text style={styles.filterLabel}>View:</Text>
          {(['All', 'ToDo', 'InProgress', 'Done'] as KitchenViewType[]).map((view) => (
            <TouchableOpacity 
              key={view} 
              style={[styles.filterTab, activeView === view && styles.activeTab]}
              onPress={() => setActiveView(view)}
            >
              <Text style={[styles.filterTabText, activeView === view && styles.activeTabText]}>{view}</Text>
            </TouchableOpacity>
          ))}
          
          <View style={styles.filterDivider} />
          
          <Text style={styles.filterLabel}>Waiter:</Text>
          {waiters.map((w) => (
            <TouchableOpacity 
              key={w} 
              style={[styles.filterTab, selectedWaiter === w && styles.activeTab]}
              onPress={() => setSelectedWaiter(w)}
            >
              <Text style={[styles.filterTabText, selectedWaiter === w && styles.activeTabText]}>{w}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Grid View */}
      <View style={styles.content}>
        {isTablet ? (
          <View style={styles.tabletGrid}>
            {renderOrderList(todoOrders.filter(o => selectedWaiter === 'All' || o.waiterName === selectedWaiter), 'To Do', '#C1C7D0')}
            {renderOrderList(inProgressOrders.filter(o => selectedWaiter === 'All' || o.waiterName === selectedWaiter), 'In Progress', '#B3D4FF')}
            {renderOrderList(doneOrders.filter(o => selectedWaiter === 'All' || o.waiterName === selectedWaiter), 'Done', '#6750A4')}
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.orderId.toString()}
            renderItem={({ item }) => (
              <KitchenOrderCard 
                order={item} 
                onStatusChange={handleStatusChange}
                onItemStatusChange={handleItemStatusChange}
              />
            )}
            contentContainerStyle={styles.mobileListContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome6 name="clipboard-list" size={48} color="#E2E8F0" />
                <Text style={styles.emptyText}>No {activeView !== 'All' ? activeView : ''} orders found</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    ...TYPOGRAPHY.montserrat.medium,
    marginTop: 12,
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: '#1E293B',
  },
  subtitle: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#94A3B8',
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 12,
    color: '#64748B',
    marginRight: 4,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#475569',
  },
  activeTabText: {
    color: 'white',
    ...TYPOGRAPHY.montserrat.bold,
  },
  filterDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  tabletGrid: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  column: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderLeftWidth: 4,
  },
  columnTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: '#1E293B',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
  },
  mobileListContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    ...TYPOGRAPHY.montserrat.medium,
    color: '#94A3B8',
    marginTop: 16,
    fontSize: 14,
  },
});
