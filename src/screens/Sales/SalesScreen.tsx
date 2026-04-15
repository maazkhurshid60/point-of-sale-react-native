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
import { useUIStore } from '../../store/useUIStore';
import { useDialogStore, DialogType } from '../../store/useDialogStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

const SalesScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  const isLandscape = width > height;
  const isLargeTablet = width > 1024;

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

  const handleEdit = async (sale: any) => {
    await useSalesStore.getState().fetchEditSaleForm(sale.sale_id, sale);
    useUIStore.getState().setScreen('EDIT_SALE');
  };

  const StatusBadge = ({ status, color }: { status: string; color: string }) => (
    <View style={[styles.badge, { backgroundColor: color + '15', borderColor: color + '30' }]}>
      <Text style={[styles.badgeText, { color }]}>{status}</Text>
    </View>
  );

  const contentMaxWidth = isLargeTablet ? 1200 : isTablet ? 1000 : '100%';

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[styles.headerInner, { maxWidth: contentMaxWidth, alignSelf: 'center' }]}>
        <View>
          <Text style={styles.breadcrumb}>Dashboard / <Text style={{ color: COLORS.primary }}>Sales History</Text></Text>
          <Text style={styles.title}>Sales Records</Text>
        </View>
        <View style={styles.headerActions}>
          {isTablet && (
            <Pressable style={styles.resetAllBtn} onPress={() => { resetFilters(); fetchSales(1); }}>
              <FontAwesome6 name="filter-circle-xmark" size={14} color={COLORS.posRed} />
              <Text style={styles.resetAllText}>Reset Filters</Text>
            </Pressable>
          )}
          <Pressable style={styles.refreshButton} onPress={onRefresh}>
            <FontAwesome6 name="rotate" size={16} color={COLORS.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={[
      styles.filterSection,
      { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
      (!isTablet && !isLandscape) && styles.filterSectionMobile,
      isLandscape && !isTablet && { flexWrap: 'nowrap' }
    ]}>
      {/* Sale Type Picker */}
      <View style={[styles.filterItem, !isTablet && !isLandscape && { width: '48.5%' }]}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={filters.saleType}
            onValueChange={(val) => { setFilter('saleType', val); fetchSales(1); }}
            style={styles.picker}
            dropdownIconColor={COLORS.primary}
            mode="dropdown"
          >
            <Picker.Item label="Sales Records" value="sale" color={COLORS.textDark} />
            <Picker.Item label="Sample Records" value="sample" color={COLORS.textDark} />
          </Picker>
        </View>
      </View>

      {/* Invoice Search */}
      <View style={[styles.searchContainer, !isTablet && !isLandscape && { width: '48.5%' }]}>
        <FontAwesome6 name="magnifying-glass" size={14} color={COLORS.greyText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Invoice #"
          placeholderTextColor={COLORS.greyText}
          value={filters.invoiceNo}
          onChangeText={(val) => setFilter('invoiceNo', val)}
          onSubmitEditing={() => fetchSales(1)}
        />
      </View>

      {/* Date Filter */}
      <View style={[styles.dateContainer, !isTablet && !isLandscape && { width: '48.5%' }]}>
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={COLORS.greyText}
          value={filters.date || ''}
          onChangeText={(val) => setFilter('date', val)}
          onSubmitEditing={() => fetchSales(1)}
        />
        <FontAwesome6 name="calendar-days" size={14} color={COLORS.primary} />
      </View>

      {/* Customer Picker */}
      <View style={[styles.filterItem, !isTablet && !isLandscape && { width: '48.5%' }, (isTablet || isLandscape) && { flex: 1.5 }]}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={filters.customerId || ''}
            onValueChange={(val) => {
              setFilter('customerId', val ? String(val) : '');
              fetchSales(1);
            }}
            style={styles.picker}
            dropdownIconColor={COLORS.primary}
            mode="dropdown"
          >
            <Picker.Item label="All Customers" value="" color={COLORS.greyText} />
            {customersList.map((customer: any) => (
              <Picker.Item key={customer.customer_id} label={customer.name} value={String(customer.customer_id)} color={COLORS.textDark} />
            ))}
          </Picker>
        </View>
      </View>

      {!isTablet && filters.customerId ? (
        <Pressable style={styles.mobileResetBtn} onPress={() => { setFilter('customerId', ''); fetchSales(1); }}>
          <FontAwesome6 name="circle-xmark" size={16} color={COLORS.posRed} />
        </Pressable>
      ) : null}
    </View>
  );

  const renderPagination = () => {
    if (sales.length === 0) return null;

    return (
      <View style={styles.paginationContainer}>
        <View style={[styles.paginationInner, { maxWidth: contentMaxWidth, alignSelf: 'center' }]}>
          <Pressable
            style={[styles.pageButton, !pagination.hasPrevPage && styles.pageButtonDisabled]}
            onPress={() => pagination.hasPrevPage && fetchSales(pagination.currentPage - 1)}
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
            onPress={() => pagination.hasNextPage && fetchSales(pagination.currentPage + 1)}
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
      <Text style={[styles.columnHeader, { flex: 0.8 }]}>ID</Text>
      <Text style={[styles.columnHeader, { flex: 2.2 }]}>INVOICE</Text>
      <Text style={[styles.columnHeader, { flex: 1.2 }]}>DATE</Text>
      <Text style={[styles.columnHeader, { flex: 2.0 }]}>CUSTOMER</Text>
      <Text style={[styles.columnHeader, { flex: 2.5 }]}>STATUS</Text>
      <Text style={[styles.columnHeader, { flex: 1.2, textAlign: 'right' }]}>TOTAL</Text>
      <Text style={[styles.columnHeader, { flex: 1.2, textAlign: 'right' }]}>PAID</Text>
      <Text style={[styles.columnHeader, { flex: 1.2, textAlign: 'right' }]}>BAL</Text>
      <Text style={[styles.columnHeader, { flex: 2.5, textAlign: 'right' }]}>ACTIONS</Text>
    </View>
  );

  const renderTableRow = (item: any, idx: number) => (
    <View key={item.sale_id || idx} style={styles.tableRow}>
      <Text style={[styles.cellText, { flex: 0.8, color: COLORS.greyText }]}>{item.sale_id}</Text>
      <Text style={[styles.cellText, styles.invoiceText, { flex: 2.2 }]} selectable>{item.invoice_no}</Text>
      <View style={{ flex: 1.2 }}>
        <Text style={styles.cellText}>
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
        </Text>
      </View>
      <Text style={[styles.cellText, { flex: 2.0 }]} numberOfLines={1}>{item.customer?.name || 'Walk-in Customer'}</Text>

      <View style={[styles.cell, { flex: 2.5, flexDirection: 'row', gap: 4, flexWrap: 'wrap' }]}>
        {item.status === 'Fulfilled' && <StatusBadge status="Fulfilled" color={COLORS.posGreen} />}
        {item.status === 'Unfulfilled' && <StatusBadge status="Unfulfilled" color={COLORS.posRed} />}
        {item.payment_status === 'Paid' && <StatusBadge status="Paid" color={COLORS.posGreen} />}
        {item.payment_status === 'Partial' && <StatusBadge status="Partial" color={'#f59e0b'} />}
        {item.payment_status === 'Owing' && <StatusBadge status="Owing" color={COLORS.posRed} />}
        {item.payment_status === 'UnInvoiced' && <StatusBadge status="UnInvoiced" color={COLORS.greyText} />}
        {item.payment_status === 'Invoiced' && <StatusBadge status="Invoiced" color={COLORS.primary} />}
      </View>

      <Text style={[styles.cellText, styles.totalText, { flex: 1.2, textAlign: 'right' }]}>{item.total_bill}</Text>
      <Text style={[styles.cellText, styles.totalText, { flex: 1.2, textAlign: 'right', color: COLORS.posGreen }]}>{item.amount_paid}</Text>
      <Text style={[styles.cellText, styles.totalText, { flex: 1.2, textAlign: 'right', color: Number(item.balance) > 0 ? COLORS.posRed : COLORS.textDark }]}>{item.balance}</Text>

      <View style={[styles.cell, { flex: 2.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }]}>
        <View style={styles.actionPickerContainer}>
          <Picker
            selectedValue={"Select"}
            style={styles.actionPicker}
            onValueChange={(val) => {
              if (val !== 'Select') {
                handleAction(val, item);
              }
            }}
            dropdownIconColor={COLORS.primary}
            mode="dropdown"
          >
            <Picker.Item label="Quick View" value="Select" color="#64748B" style={{ backgroundColor: COLORS.white }} />
            <Picker.Item label="Invoice Slip" value="Invoice" color="#111827" style={{ backgroundColor: COLORS.white }} />
            <Picker.Item label="Bill Ticket" value="Ticket" color="#111827" style={{ backgroundColor: COLORS.white }} />
            <Picker.Item label="Delivery GDS" value="GDS" color="#111827" style={{ backgroundColor: COLORS.white }} />
            <Picker.Item label="Issuance GIS" value="GIS" color="#111827" style={{ backgroundColor: COLORS.white }} />
            {item.type === 'sample' && <Picker.Item label="Sample Slip" value="Sample" color="#111827" style={{ backgroundColor: COLORS.white }} />}
          </Picker>
        </View>
        <Pressable style={styles.editIcon} onPress={() => handleEdit(item)}>
          <FontAwesome6 name="pen-to-square" size={14} color={COLORS.primary} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <View style={styles.mainContent}>
        {renderFilters()}

        <View style={[
          styles.tableBlock,
          { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
          isLandscape && { flex: 1 }
        ]}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} style={{ flex: 1 }}>
            <View style={{ minWidth: (isTablet || isLandscape) ? Math.max(width - 40, 1050) : 950, flex: 1 }}>
              {renderTableHeader()}
              {isLoading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loaderText}>Fetching sales records...</Text>
                </View>
              ) : sales.length > 0 ? (
                sales.map(renderTableRow)
              ) : (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconCircle}>
                    <FontAwesome6 name="box-open" size={24} color={COLORS.greyText} />
                  </View>
                  <Text style={styles.emptyText}>No sales records found</Text>
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
    zIndex: 10,
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
  resetAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
  },
  resetAllText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 13,
    color: COLORS.posRed,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  filterSectionMobile: {
    flexWrap: 'wrap',
    gap: 10,
  },
  filterItem: {
    flex: 1,
    height: 52, // Increased height for picker visibility
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: 'white', // Clean pure white
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    height: 52,
    width: '100%',
    color: '#1E293B', // High-contrast Slate text
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#1E293B',
  },
  dateContainer: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 15,
  },
  dateInput: {
    flex: 1,
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#1E293B',
  },
  mobileResetBtn: {
    padding: 10,
    justifyContent: 'center',
  },
  tableBlock: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
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
  },
  cellText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 13,
    color: '#334155',
  },
  invoiceText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: COLORS.primary,
  },
  totalText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
  },
  cell: {
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  actionPickerContainer: {
    width: 120,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: 'white', // Clean pure white
    overflow: 'hidden',
    justifyContent: 'center',
  },
  actionPicker: {
    height: 38,
    width: '100%',
    color: '#1E293B', // High-contrast Slate text
    backgroundColor: 'transparent',
  },
  editIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
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

export default SalesScreen;
