import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useOfflineSalesStore, OfflineSale } from '../../store/useOfflineSalesStore';
import { useAuthStore } from '../../store/useAuthStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

const EMPTY_ARRAY: any[] = [];

const OfflineSalesScreen: React.FC = () => {
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

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.breadcrumb}>Dashboard / <Text style={{ color: COLORS.primary }}>Offline Mode</Text></Text>
        <Text style={styles.title}>Offline Sales</Text>
      </View>

      <View style={styles.headerActions}>
        <Pressable style={[styles.actionBtn, styles.exportBtn]}>
          <FontAwesome6 name="file-export" size={14} color="#fff" />
          {isTablet && <Text style={styles.actionBtnText}>Export</Text>}
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.importBtn]}>
          <FontAwesome6 name="file-import" size={14} color="#fff" />
          {isTablet && <Text style={styles.actionBtnText}>Import</Text>}
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDeleteAll}>
          <FontAwesome6 name="trash-can" size={14} color="#fff" />
          {isTablet && <Text style={styles.actionBtnText}>Clear All</Text>}
        </Pressable>
      </View>
    </View>
  );

  const renderLimitTracker = () => (
    <View style={styles.trackerContainer}>
      <View style={styles.trackerHeader}>
        <Text style={styles.trackerLabel}>Local Storage Limit</Text>
        <Text style={styles.trackerStatus}>
          {sales.length} / {OFFLINE_LIMIT} Sales
        </Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${Math.min(usedPercentage, 100)}%` }]} />
      </View>
      {sales.length >= OFFLINE_LIMIT && (
        <Text style={styles.limitWarning}>Limit reached! Please sync or clear sales.</Text>
      )}
    </View>
  );

  const renderSaleItem = (sale: OfflineSale) => {
    const isExpanded = expandedSaleId === sale.sale_id;
    const items = sale.sale_items || [];

    return (
      <View key={sale.sale_id} style={styles.saleItem}>
        <Pressable
          style={styles.saleRowHeader}
          onPress={() => setExpandedSaleId(isExpanded ? null : sale.sale_id)}
        >
          <View style={styles.saleMainInfo}>
            <View style={styles.idCircle}>
              <Text style={styles.idText}>{sale.sale_id.slice(-2)}</Text>
            </View>
            <View>
              <Text style={styles.saleTitle}>Sale #{sale.sale_id.slice(-6)}</Text>
              <Text style={styles.saleSubtitle}>
                {new Date(sale.created_at).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.saleRightInfo}>
            <Text style={styles.saleAmount}>${sale.total?.toFixed(2)}</Text>
            <FontAwesome6 name={isExpanded ? "chevron-up" : "chevron-down"} size={14} color={COLORS.greyText} />
          </View>
        </Pressable>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            <Text style={styles.itemsLabel}>Items List:</Text>
            {items.map((item: any, idx: number) => (
              <View key={idx} style={styles.productRow}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDetails}>{item.qty} x ${item.selling_price}</Text>
                <Text style={styles.productTotal}>${(item.qty * item.selling_price).toFixed(2)}</Text>
              </View>
            ))}

            <View style={styles.actionButtonsRow}>
              <Pressable style={styles.syncBtn} onPress={() => syncSale(sale)}>
                <FontAwesome6 name="cloud-arrow-up" size={14} color="#fff" />
                <Text style={styles.syncBtnText}>Sync Now</Text>
              </Pressable>
              <Pressable style={styles.inlineDeleteBtn} onPress={() => removeOfflineSale(sale.sale_id)}>
                <FontAwesome6 name="xmark" size={14} color={COLORS.posRed} />
                <Text style={styles.inlineDeleteText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderLimitTracker()}

      <View style={styles.filtersPlaceholder}>
        <FontAwesome6 name="sliders" size={14} color={COLORS.primary} />
        <Text style={styles.filterPlaceholderText}>Filters (Date, Customer, Amount)</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.salesList}>
        {isLoading && (
          <View style={styles.overlayLoader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}

        {sales.length > 0 ? (
          sales.map(renderSaleItem)
        ) : (
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="cloud-sun" size={64} color={COLORS.greyText} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>No offline sales are waiting to be synced.</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  breadcrumb: {
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 12,
    color: COLORS.greyText,
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
    color: COLORS.black,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  actionBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 12,
    color: '#fff',
  },
  exportBtn: { backgroundColor: COLORS.posGreen },
  importBtn: { backgroundColor: COLORS.primary },
  deleteBtn: { backgroundColor: COLORS.posRed },
  trackerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  trackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  trackerLabel: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: COLORS.black,
  },
  trackerStatus: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: COLORS.greyText,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#dee2e6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  limitWarning: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: COLORS.posRed,
    marginTop: 8,
    textAlign: 'center',
  },
  filtersPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  filterPlaceholderText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: COLORS.primary,
  },
  salesList: {
    flex: 1,
  },
  saleItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f3f5',
    marginBottom: 12,
    overflow: 'hidden',
  },
  saleRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  saleMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  idCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  idText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: COLORS.primary,
    fontSize: 14,
  },
  saleTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: COLORS.black,
  },
  saleSubtitle: {
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 12,
    color: COLORS.greyText,
  },
  saleRightInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  saleAmount: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: COLORS.black,
  },
  expandedContent: {
    padding: 15,
    paddingTop: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f3f5',
    marginBottom: 15,
  },
  itemsLabel: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 13,
    color: COLORS.greyText,
    marginBottom: 8,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  productName: {
    flex: 2,
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#495057',
  },
  productDetails: {
    flex: 1,
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 12,
    color: COLORS.greyText,
    textAlign: 'center',
  },
  productTotal: {
    flex: 1,
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 14,
    color: COLORS.black,
    textAlign: 'right',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  syncBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  syncBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: '#fff',
    fontSize: 14,
  },
  inlineDeleteBtn: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.posRed + '30',
    gap: 8,
  },
  inlineDeleteText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: COLORS.posRed,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 20,
    color: COLORS.black,
    marginTop: 20,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: COLORS.greyText,
    textAlign: 'center',
    marginTop: 8,
  },
  overlayLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default OfflineSalesScreen;
