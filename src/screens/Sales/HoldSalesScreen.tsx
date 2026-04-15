import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { HoldSaleModel } from '../../models';

export const HoldSalesScreen: React.FC = () => {
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

  const renderItem = ({ item }: { item: HoldSaleModel }) => {
    if (isTablet) {
      return (
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { flex: 1.5 }]}>{new Date(item.created_at).toLocaleString()}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>Customer #{item.customer_id}</Text>
          <Text style={[styles.cell, { flex: 0.8 }]}>{item.total_bill.toFixed(2)}</Text>
          <Text style={[styles.cell, { flex: 0.8 }]}>{item.actual_bill.toFixed(2)}</Text>
          <Text style={[styles.cell, { flex: 0.8, color: item.balance > 0 ? COLORS.posRed : COLORS.posGreen }]}>
            {item.balance.toFixed(2)}
          </Text>
          <View style={[styles.actionsCell]}>
            <TouchableOpacity style={styles.recallBtn} onPress={() => handleRecall(item)}>
              <FontAwesome6 name="rotate-left" size={14} color="white" />
              <Text style={styles.btnText}>Recall</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.sale_id)}>
              <FontAwesome6 name="trash" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.saleCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Sale #{item.sale_id}</Text>
          <Text style={styles.cardDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Total Bill:</Text>
            <Text style={styles.cardValue}>{item.total_bill.toFixed(2)}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Balance:</Text>
            <Text style={[styles.cardValue, { color: item.balance > 0 ? COLORS.posRed : COLORS.posGreen }]}>
              {item.balance.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={[styles.actionBtn, styles.recallBtn]} onPress={() => handleRecall(item)}>
            <FontAwesome6 name="rotate-left" size={14} color="white" />
            <Text style={styles.btnText}>Recall POS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item.sale_id)}>
            <FontAwesome6 name="trash" size={14} color="white" />
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('DEFAULT')}>
          <FontAwesome6 name="arrow-left" size={20} color={COLORS.primary} />
          <Text style={styles.backText}>Back to POS</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Recall Held Sales</Text>
          <Text style={styles.headerSubtitle}>Manage your saved drafts</Text>
        </View>
      </View>

      {isTablet && (
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 1.5 }]}>Date & Time</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Customer</Text>
          <Text style={[styles.headerCell, { flex: 0.8 }]}>Total Bill</Text>
          <Text style={[styles.headerCell, { flex: 0.8 }]}>Actual Bill</Text>
          <Text style={[styles.headerCell, { flex: 0.8 }]}>Balance</Text>
          <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>Actions</Text>
        </View>
      )}

      <FlatList
        data={holdSales}
        keyExtractor={(item) => item.sale_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <FontAwesome6 name="folder-open" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No held sales found</Text>
            </View>
          ) : null
        }
        onEndReached={() => nextPageUrl && loadHoldSales(nextPageUrl)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 20 }} color={COLORS.primary} /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  backText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    color: COLORS.primary,
    marginLeft: 8,
    fontSize: 14,
  },
  headerTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 20,
    color: '#1E293B',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#64748B',
  },
  listContent: {
    padding: 16,
  },
  // Tablet Table Styles
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#F1F5F9',
  },
  headerCell: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: '#475569',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cell: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#334155',
  },
  actionsCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  // Mobile Card Styles
  saleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#1E293B',
  },
  cardDate: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#64748B',
  },
  cardBody: {
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#64748B',
  },
  cardValue: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 14,
    color: '#334155',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  recallBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  deleteBtn: {
    backgroundColor: COLORS.posRed,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  btnText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    ...TYPOGRAPHY.montserrat.medium,
    color: '#94A3B8',
    marginTop: 16,
    fontSize: 16,
  },
});
