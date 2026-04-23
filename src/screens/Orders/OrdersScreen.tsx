import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Pressable
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useOrderStore } from '../../store/useOrderStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { GeneralOrder } from '../../models';
import { CustomButton } from '../../components/common/CustomButton';

export const OrdersScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  const isLandscape = width > height;
  const isLargeTablet = width > 1024;

  const orders = useOrderStore((state) => state.orders);
  const isLoading = useOrderStore((state) => state.isLoading);
  const pagination = useOrderStore((state) => state.pagination);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  const [activeDropdownRow, setActiveDropdownRow] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const onRefresh = useCallback(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const handleAction = (action: 'Delete' | 'Sale' | 'Purchase', order: GeneralOrder) => {
    setActiveDropdownRow(null);
    if (action === 'Delete') {
      alert('Delete functionality will be added later.');
    } else {
      alert(`${action === 'Sale' ? 'Convert to Sale' : 'Convert to Purchase'} logic coming soon.`);
    }
  };

  const contentMaxWidth = isLargeTablet ? 1200 : isTablet ? 1000 : '100%';

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[styles.headerInner, { maxWidth: contentMaxWidth, alignSelf: 'center' }]}>
        <View>
          <Text style={styles.breadcrumb}>Dashboard / <Text style={{ color: COLORS.primary }}>Orders List</Text></Text>
          <Text style={styles.title}>Orders Management</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.refreshButton} onPress={onRefresh}>
            <FontAwesome6 name="rotate" size={16} color={COLORS.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderPagination = () => {
    if (orders.length === 0) return null;

    return (
      <View style={styles.paginationContainer}>
        <View style={[styles.paginationInner, { maxWidth: contentMaxWidth, alignSelf: 'center' }]}>
          <Pressable
            style={[styles.pageButton, !pagination.hasPrevPage && styles.pageButtonDisabled]}
            onPress={() => pagination.hasPrevPage && fetchOrders(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage || isLoading}
          >
            <FontAwesome6 name="chevron-left" size={12} color={!pagination.hasPrevPage ? COLORS.greyText : COLORS.primary} />
            <Text style={[styles.pageButtonText, !pagination.hasPrevPage && { color: COLORS.greyText }]}>Previous</Text>
          </Pressable>

          <View style={styles.pageIndicator}>
            <Text style={styles.pageInfoText}>
              Page <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{pagination.currentPage}</Text>
            </Text>
            {pagination.total > 0 && <Text style={styles.totalRecordsText}>{pagination.total} Records Found</Text>}
          </View>

          <Pressable
            style={[styles.pageButton, !pagination.hasNextPage && styles.pageButtonDisabled]}
            onPress={() => pagination.hasNextPage && fetchOrders(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage || isLoading}
          >
            <Text style={[styles.pageButtonText, !pagination.hasNextPage && { color: COLORS.greyText }]}>Next</Text>
            <FontAwesome6 name="chevron-right" size={12} color={!pagination.hasNextPage ? COLORS.greyText : COLORS.primary} />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeaderRow}>
      <View style={{ flex: 0.8 }}><Text style={styles.columnHeader}>ID</Text></View>
      <View style={{ flex: 1.5 }}><Text style={styles.columnHeader}>DATE</Text></View>
      <View style={{ flex: 1.2 }}><Text style={styles.columnHeader}>USER</Text></View>
      <View style={{ flex: 1.2 }}><Text style={styles.columnHeader}>EMPLOYEE</Text></View>
      <View style={{ flex: 2.0 }}><Text style={styles.columnHeader}>CUSTOMER</Text></View>
      <View style={{ flex: 1.0 }}><Text style={styles.columnHeader}>STORE</Text></View>
      <View style={{ flex: 2.5 }}><Text style={styles.columnHeader}>PRODUCTS</Text></View>
      <View style={{ flex: 0.8, alignItems: 'center' }}><Text style={styles.columnHeader}>QTY</Text></View>
      <View style={{ flex: 1.2, alignItems: 'flex-end' }}><Text style={styles.columnHeader}>TOTAL BILL</Text></View>
      <View style={{ flex: 1.5, alignItems: 'flex-end' }}><Text style={styles.columnHeader}>ACTION</Text></View>
    </View>
  );

  const renderTableRow = (item: GeneralOrder, idx: number) => {
    const productsString = item.order_item?.map(oi => oi.name).join(', ') || '-';
    const customerName = item.customer?.name || 'Walk-in-customer';

    return (
      <View key={item.id || idx} style={styles.tableRow}>
        <View style={{ flex: 0.8 }}>
          <Text style={[styles.cellText, { color: COLORS.greyText }]}>{item.id}</Text>
        </View>
        <View style={{ flex: 1.5 }}>
          <Text style={styles.cellText}>
            {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
          </Text>
        </View>
        <View style={{ flex: 1.2 }}>
          <Text style={styles.cellText} numberOfLines={1}>{item.salesman?.name || 'Admin'}</Text>
        </View>
        <View style={{ flex: 1.2 }}>
          <Text style={styles.cellText} numberOfLines={1}>-</Text>
        </View>
        <View style={{ flex: 2.0 }}>
          <Text style={[styles.cellText, { color: COLORS.primary }]} numberOfLines={1}>{customerName}</Text>
        </View>
        <View style={{ flex: 1.0 }}>
          <Text style={styles.cellText}>{item.store_id}</Text>
        </View>
        <View style={{ flex: 2.5 }}>
          <Text style={styles.cellText} numberOfLines={1}>{productsString}</Text>
        </View>
        <View style={{ flex: 0.8, alignItems: 'center' }}>
          <Text style={styles.cellText}>{item.total_quantity}</Text>
        </View>
        <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
          <Text style={[styles.cellText, styles.totalText]}>{Number(item.total_bill).toLocaleString()}</Text>
        </View>

        <View style={[styles.cell, { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }]}>
          <CustomButton
            title=""
            icon="trash-can"
            onPress={() => handleAction('Delete', item)}
            variant="danger"
            size="small"
            iconSize={12}
            style={styles.deleteBtnCustom}
          />

          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.actionBtn}
              onPress={() => setActiveDropdownRow(activeDropdownRow === item.id ? null : item.id)}
            >
              <FontAwesome6 name="ellipsis-vertical" size={14} color={COLORS.primary} />
            </TouchableOpacity>

            {activeDropdownRow === item.id && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity activeOpacity={0.7} style={styles.dropdownItem} onPress={() => handleAction('Sale', item)}>
                  <FontAwesome6 name="cart-shopping" size={12} color={COLORS.textDark} style={styles.itemIcon} />
                  <Text style={styles.dropdownItemText}>To Sale</Text>
                </TouchableOpacity>
                <View style={styles.dropdownDivider} />
                <TouchableOpacity activeOpacity={0.7} style={styles.dropdownItem} onPress={() => handleAction('Purchase', item)}>
                  <FontAwesome6 name="bag-shopping" size={12} color={COLORS.textDark} style={styles.itemIcon} />
                  <Text style={styles.dropdownItemText}>To Purchase</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      <View style={styles.mainContent}>
        <View style={[
          styles.tableBlock,
          { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
          isLandscape && { flex: 1 }
        ]}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} style={{ flex: 1 }}>
            <View style={{ minWidth: 1100, flex: 1 }}>
              {renderTableHeader()}
              {isLoading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loaderText}>Fetching orders...</Text>
                </View>
              ) : orders.length > 0 ? (
                orders.map(renderTableRow)
              ) : (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconCircle}>
                    <FontAwesome6 name="receipt" size={24} color={COLORS.greyText} />
                  </View>
                  <Text style={styles.emptyText}>No orders found</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 20,
    elevation: 2,
    zIndex: 100,
    width: '100%',
  },
  headerInner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breadcrumb: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
    color: '#1E293B',
  },
  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableBlock: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'visible', // Changed to visible for dropdown
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  columnHeader: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 1,
  },
  cellText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 13,
    color: '#334155',
  },
  totalText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
  },
  cell: {
    justifyContent: 'center',
  },
  deleteBtnCustom: {
    width: 32,
    height: 32,
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 999,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: 36,
    width: 130,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 9999,
    padding: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  itemIcon: {
    width: 20,
    marginRight: 8,
  },
  dropdownItemText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 12,
    color: COLORS.textDark,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 2,
  },
  loaderContainer: {
    padding: 60,
    alignItems: 'center',
  },
  loaderText: {
    ...TYPOGRAPHY.montserrat.medium,
    marginTop: 12,
    color: '#64748B',
  },
  emptyContainer: {
    padding: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    ...TYPOGRAPHY.montserrat.medium,
    color: '#64748B',
    fontSize: 15,
  },
  paginationContainer: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    width: '100%',
  },
  paginationInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  pageIndicator: {
    alignItems: 'center',
  },
  pageInfoText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: '#1E293B',
  },
  totalRecordsText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  pageButtonDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
  },
  pageButtonText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 13,
    color: COLORS.primary,
  },
});
