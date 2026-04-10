import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { KitchenOrder, KitchenProduct } from '../../models';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import Checkbox from 'expo-checkbox';

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onStatusChange: (orderId: number, status: KitchenOrder['status']) => void;
  onItemStatusChange: (orderId: number, productId: number, status: KitchenProduct['status']) => void;
}

export const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({ 
  order, 
  onStatusChange, 
  onItemStatusChange 
}) => {
  const isPending = order.status === 'pending';
  const isAccepted = order.status === 'accepted';
  const isDone = order.status === 'done';

  const getHeaderStyle = () => {
    if (isPending) return styles.headerPending;
    if (isAccepted) return styles.headerAccepted;
    return styles.headerDone;
  };

  const getHeaderTextStyle = () => {
    if (isPending) return styles.headerTextPending;
    if (isAccepted) return styles.headerTextAccepted;
    return styles.headerTextDone;
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '--:--';
    }
  };

  return (
    <View style={[styles.card, { borderColor: getHeaderStyle().backgroundColor }]}>
      {/* Card Header */}
      <View style={[styles.header, getHeaderStyle()]}>
        <View style={styles.headerRow}>
          <Text style={[styles.orderId, getHeaderTextStyle()]}>Order: {order.orderId}</Text>
          <Text style={[styles.time, getHeaderTextStyle()]}>{formatTime(order.createdTime)}</Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={[styles.tableInfo, getHeaderTextStyle()]}>Table: {order.tableName || order.tableId}</Text>
          <Text style={[styles.waiter, getHeaderTextStyle()]} numberOfLines={1}>Waiter: {order.waiterName}</Text>
        </View>
      </View>

      {/* Items List */}
      <View style={styles.itemsContainer}>
        {order.items.map((item, index) => (
          <View key={`${order.orderId}-${item.id}`} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemQty}>{item.quntity}x</Text>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
            </View>
            {isAccepted && (
              <Checkbox
                value={item.status === 'done'}
                onValueChange={(newValue) => 
                  onItemStatusChange(order.orderId, item.id, newValue ? 'done' : 'pending')
                }
                color={COLORS.primary}
                style={styles.checkbox}
              />
            )}
          </View>
        ))}
      </View>

      {/* Action Footer */}
      {!isDone && (
        <View style={styles.footer}>
          {isPending ? (
            <TouchableOpacity 
              style={styles.acceptBtn} 
              onPress={() => onStatusChange(order.orderId, 'accepted')}
            >
              <Text style={styles.btnText}>Accept Order</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.doneBtn} 
              onPress={() => onStatusChange(order.orderId, 'done')}
            >
              <FontAwesome6 name="check" size={14} color="white" />
              <Text style={styles.btnText}>Mark Done</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    padding: 10,
    gap: 4,
  },
  headerPending: { backgroundColor: '#C1C7D0' },
  headerAccepted: { backgroundColor: '#B3D4FF' },
  headerDone: { backgroundColor: '#6750A4' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 13,
  },
  time: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 11,
  },
  tableInfo: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 12,
  },
  waiter: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 11,
    maxWidth: '60%',
  },
  headerTextPending: { color: '#42526E' },
  headerTextAccepted: { color: '#0747A6' },
  headerTextDone: { color: '#FFFFFF' },
  itemsContainer: {
    padding: 12,
    gap: 10,
    minHeight: 100,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 10,
  },
  itemQty: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 12,
    color: COLORS.textDark,
  },
  itemName: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#4B5C69',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  doneBtn: {
    backgroundColor: '#38A169',
    paddingVertical: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 13,
  },
});
