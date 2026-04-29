import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { KitchenOrderCard } from '../../components/kitchen/KitchenOrderCard';
import { COLORS } from '../../constants/colors';
import { KitchenOrder } from '../../models';
import { useOrderReviewController, KitchenViewType } from './hooks/useOrderReviewController';
import { styles } from './OrderReviewScreen.styles';

export const OrderReviewScreen: React.FC = () => {
  const {
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
  } = useOrderReviewController();

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

export default OrderReviewScreen;
