import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useSalesStore } from '../../store/useSalesStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useDialogStore, DialogType } from '../../store/useDialogStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

const SalesScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const sales = useSalesStore((state) => state.sales);
  const isLoading = useSalesStore((state) => state.isLoading);
  const filters = useSalesStore((state) => state.filters);
  const fetchSales = useSalesStore((state) => state.fetchSales);
  const setFilter = useSalesStore((state) => state.setFilter);
  const resetFilters = useSalesStore((state) => state.resetFilters);
  const pagination = useSalesStore((state) => state.pagination);
  const getSaleInvoice = useSalesStore((state) => state.getSaleInvoice);
  const showDialog = useDialogStore((state) => state.showDialog);

  const [customersList, setCustomersList] = useState<any[]>([]);
  const fetchStoreOptions = useAuthStore((state) => state.fetchStoreOptions);

  useEffect(() => {
    fetchSales(1);
    fetchStoreOptions();
    useAuthStore.getState().fetchCustomers().then((data) => {
      setCustomersList(data || []);
    });
  }, []);

  const onRefresh = useCallback(() => {
    fetchSales(1);
  }, [fetchSales]);

  const handleAction = async (action: string, sale: any) => {
    if (action === 'Select') return;

    let type = '';
    let dialogType: DialogType = 'INVOICE_SLIP';

    switch (action) {
      case 'Invoice':
        type = 'invoice';
        dialogType = 'INVOICE_SLIP';
        break;
      case 'Ticket':
        type = '';
        dialogType = 'RAW_BILL_SLIP';
        break;
      case 'GDS':
        type = 'gdn';
        dialogType = 'GOODS_DELIVERY_SLIP';
        break;
      case 'GIS':
        type = 'goods_issuance_slip';
        dialogType = 'GOODS_ISSUANCE_SLIP';
        break;
      case 'Sample':
        type = 'sample_sale_slip';
        dialogType = 'SAMPLE_SALE_SLIP';
        break;
      default:
        return;
    }

    try {
      const slipData = await getSaleInvoice(sale.sale_id, type);
      if (slipData) {
        showDialog(dialogType, { slipData });
      } else {
        showDialog('ERROR', { errorMessage: 'Failed to fetch slip data.' });
      }
    } catch (err) {
      showDialog('ERROR', { errorMessage: 'Something went wrong while fetching the slip.' });
    }
  };

  const StatusBadge = ({ status, color }: { status: string; color: string }) => (
    <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{status}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.breadcrumb}>Dashboard / <Text style={{ color: COLORS.primary }}>Sales History</Text></Text>
        <Text style={styles.title}>Sales Records</Text>
      </View>
      <Pressable style={styles.refreshButton} onPress={onRefresh}>
        <FontAwesome6 name="rotate" size={16} color={COLORS.primary} />
      </Pressable>
    </View>
  );

  const renderFilters = () => (
    <View style={[styles.filterSection, { flexWrap: 'wrap' }]}>
      <View style={{ minWidth: isTablet ? 'auto' : '47%', flex: isTablet ? 1 : 1, height: 46, borderRadius: 12, borderWidth: 1, borderColor: '#e9ecef', overflow: 'hidden' }}>
        <Picker
          selectedValue={filters.saleType}
          onValueChange={(val) => { setFilter('saleType', val); fetchSales(1); }}
          style={{ height: 46, backgroundColor: '#f8f9fa' }}
        >
          <Picker.Item label="Sales" value="sale" />
          <Picker.Item label="Samples" value="sample" />
        </Picker>
      </View>

      <View style={[styles.searchContainer, { minWidth: isTablet ? 'auto' : '47%', flex: isTablet ? 1 : 1 }]}>
        <FontAwesome6 name="magnifying-glass" size={14} color={COLORS.greyText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Invoice/Ticket"
          placeholderTextColor={COLORS.greyText}
          value={filters.invoiceNo}
          onChangeText={(val) => setFilter('invoiceNo', val)}
          onSubmitEditing={() => fetchSales(1)}
        />
      </View>

      <View style={{ minWidth: isTablet ? 'auto' : '47%', flex: isTablet ? 1 : 1, height: 46, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, borderWidth: 1, borderColor: '#e9ecef', paddingHorizontal: 10 }}>
        <TextInput
          style={{ flex: 1, ...TYPOGRAPHY.montserrat.regular }}
          placeholder="YYYY-MM-DD"
          value={filters.date || ''}
          onChangeText={(val) => setFilter('date', val)}
          onSubmitEditing={() => fetchSales(1)}
        />
        <FontAwesome6 name="calendar-days" size={14} color={COLORS.primary} />
      </View>

      <View style={{ minWidth: isTablet ? 'auto' : '47%', flex: isTablet ? 1.5 : 1, height: 46, borderRadius: 12, borderWidth: 1, borderColor: '#e9ecef', overflow: 'hidden' }}>
        <Picker
          selectedValue={filters.customerId || ''}
          onValueChange={(val) => {
            setFilter('customerId', val ? String(val) : '');
            fetchSales(1);
          }}
          style={{ height: 46, backgroundColor: '#f8f9fa' }}
        >
          <Picker.Item label="Choose Customer" value="" color={COLORS.greyText} />
          {customersList.map((customer: any) => (
            <Picker.Item key={customer.customer_id} label={customer.name} value={String(customer.customer_id)} />
          ))}
        </Picker>
      </View>

      {filters.customerId ? (
        <Pressable style={styles.resetButton} onPress={() => { setFilter('customerId', ''); fetchSales(1); }}>
          <FontAwesome6 name="circle-xmark" size={16} color={COLORS.posRed} />
        </Pressable>
      ) : null}
    </View>
  );

  const renderPagination = () => {
    console.log('Current Pagination State:', pagination);
    if (sales.length === 0) return null;

    return (
      <View style={styles.paginationContainer}>
        <Pressable
          style={[styles.pageButton, !pagination.hasPrevPage && styles.pageButtonDisabled]}
          onPress={() => pagination.hasPrevPage && fetchSales(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage || isLoading}
        >
          <FontAwesome6 name="chevron-left" size={14} color={!pagination.hasPrevPage ? COLORS.greyText : COLORS.primary} />
          <Text style={[styles.pageButtonText, !pagination.hasPrevPage && { color: COLORS.greyText }]}>Prev</Text>
        </Pressable>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageInfoText}>
            Page <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{pagination.currentPage}</Text>
          </Text>
          {pagination.total > 0 && <Text style={styles.totalRecordsText}>{pagination.total} Records</Text>}
        </View>

        <Pressable
          style={[styles.pageButton, !pagination.hasNextPage && styles.pageButtonDisabled]}
          onPress={() => pagination.hasNextPage && fetchSales(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage || isLoading}
        >
          <Text style={[styles.pageButtonText, !pagination.hasNextPage && { color: COLORS.greyText }]}>Next</Text>
          <FontAwesome6 name="chevron-right" size={14} color={!pagination.hasNextPage ? COLORS.greyText : COLORS.primary} />
        </Pressable>
      </View>
    );
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeaderRow}>
      <Text style={[styles.columnHeader, { flex: 1.0 }]}>ID</Text>
      <Text style={[styles.columnHeader, { flex: 2.2 }]}>INVOICE</Text>
      <Text style={[styles.columnHeader, { flex: 1.2 }]}>DATE</Text>
      <Text style={[styles.columnHeader, { flex: 2.0 }]}>CUSTOMER</Text>
      <Text style={[styles.columnHeader, { flex: 2.5 }]}>STATUS</Text>
      <Text style={[styles.columnHeader, { flex: 1.2, textAlign: 'right' }]}>TOTAL</Text>
      <Text style={[styles.columnHeader, { flex: 1.2, textAlign: 'right' }]}>PAID</Text>
      <Text style={[styles.columnHeader, { flex: 1.2, textAlign: 'right' }]}>BALANCE</Text>
      <Text style={[styles.columnHeader, { flex: 0.5, textAlign: 'center' }]}>TABLE</Text>
      <Text style={[styles.columnHeader, { flex: 2.5, textAlign: 'right' }]}>ACTIONS</Text>
    </View>
  );

  const renderTableRow = (item: any, idx: number) => (
    <View key={item.sale_id || idx} style={styles.tableRow}>
      <Text style={[styles.cellText, { flex: 1.0 }]}>{item.sale_id}</Text>
      <Text style={[styles.cellText, styles.invoiceText, { flex: 2.2 }]} selectable>{item.invoice_no}</Text>
      <Text style={[styles.cellText, { flex: 1.2 }]}>
        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
      </Text>
      <Text style={[styles.cellText, { flex: 2.0 }]} numberOfLines={1}>{item.customer?.name || 'Walk-in'}</Text>

      <View style={[styles.cell, { flex: 2.5, flexDirection: 'row', gap: 4, flexWrap: 'wrap' }]}>
        {item.status === 'Fulfilled' && <StatusBadge status="Fulfilled" color={COLORS.posGreen} />}
        {item.status === 'Unfulfilled' && <StatusBadge status="Unfulfilled" color={COLORS.posRed} />}
        {item.payment_status === 'Paid' && <StatusBadge status="Paid" color={COLORS.posGreen} />}
        {item.payment_status === 'Partial' && <StatusBadge status="Partial" color={'#f39c12'} />}
        {item.payment_status === 'Owing' && <StatusBadge status="Owing" color={COLORS.posRed} />}
        {item.payment_status === 'UnInvoiced' && <StatusBadge status="UnInvoiced" color={COLORS.greyText} />}
        {item.payment_status === 'Invoiced' && <StatusBadge status="Invoiced" color={COLORS.primary} />}
      </View>

      <Text style={[styles.cellText, styles.totalText, { flex: 1.2, textAlign: 'right' }]}>{item.total_bill}</Text>
      <Text style={[styles.cellText, styles.totalText, { flex: 1.2, textAlign: 'right' }]}>{item.amount_paid}</Text>
      <Text style={[styles.cellText, styles.totalText, { flex: 1.2, textAlign: 'right' }]}>{item.balance}</Text>
      <Text style={[styles.cellText, { flex: 0.5, textAlign: 'center' }]}>{''}</Text>

      <View style={[styles.cell, { flex: 2.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }]}>
        <View style={styles.actionPickerContainer}>
          <Picker
            selectedValue={"Select"}
            style={styles.actionPicker}
            onValueChange={(val) => {
              if (val !== 'Select') {
                handleAction(val, item);
              }
            }}
          >
            <Picker.Item label="Action" value="Select" color={COLORS.greyText} />
            <Picker.Item label="Invoice" value="Invoice" />
            <Picker.Item label="Ticket" value="Ticket" />
            <Picker.Item label="GDS" value="GDS" />
            <Picker.Item label="GIS" value="GIS" />
            {item.type === 'sample' && <Picker.Item label="Sample Slip" value="Sample" />}
          </Picker>
        </View>
        <Pressable style={styles.actionIcon} onPress={() => { console.log('Edit Sale', item.sale_id) }}>
          <FontAwesome6 name="pen-to-square" size={16} color={COLORS.primary} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilters()}

      <View style={styles.tableContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} style={{ flex: 1 }}>
          <View style={{ minWidth: isTablet ? 0 : 900, flex: 1 }}>
            {renderTableHeader()}
            <ScrollView showsVerticalScrollIndicator={false}>
              {isLoading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loaderText}>Fetching sales...</Text>
                </View>
              ) : sales.length > 0 ? (
                sales.map(renderTableRow)
              ) : (
                <View style={styles.emptyContainer}>
                  <FontAwesome6 name="folder-open" size={48} color={COLORS.greyText} />
                  <Text style={styles.emptyText}>No sales records found</Text>
                </View>
              )}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </ScrollView>
        {renderPagination()}
      </View>
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
    alignItems: 'center',
    marginBottom: 20,
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
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 14,
    color: COLORS.black,
  },
  filterOptions: {
    flex: 1.5,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '05',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
    gap: 6,
  },
  filterChipText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: COLORS.primary,
  },
  resetButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  resetButtonText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: COLORS.posRed,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f3f5',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  columnHeader: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 12,
    color: COLORS.greyText,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
    alignItems: 'center',
  },
  cellText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: '#495057',
  },
  invoiceText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: COLORS.primary,
  },
  totalText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: COLORS.black,
  },
  cell: {
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 11,
  },
  actionPickerContainer: {
    width: 100,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  actionPicker: {
    height: 34,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  actionIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loaderText: {
    ...TYPOGRAPHY.montserrat.medium,
    marginTop: 6,
    color: COLORS.greyText,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.montserrat.medium,
    marginTop: 20,
    color: COLORS.greyText,
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  pageIndicator: {
    alignItems: 'center',
  },
  pageInfoText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: COLORS.black,
  },
  totalRecordsText: {
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 11,
    color: COLORS.greyText,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
    elevation: 1,
  },
  pageButtonDisabled: {
    backgroundColor: '#f1f3f5',
    borderColor: '#e9ecef',
    elevation: 0,
  },
  pageButtonText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 13,
    color: COLORS.primary,
  },
});

export default SalesScreen;
