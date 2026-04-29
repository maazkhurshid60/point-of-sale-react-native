import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { COLORS } from '../../constants/colors';
import { CustomButton } from '../../components/common/CustomButton';
import { useSalesController } from './hooks/useSalesController';
import { styles } from './SalesScreen.styles';

const SalesScreen: React.FC = () => {
  const {
    isTablet,
    isLandscape,
    contentMaxWidth,
    sales,
    isLoading,
    filters,
    customers,
    pagination,
    setFilter,
    resetFilters,
    handlePageChange,
    onRefresh,
    handleAction,
    handleEdit,
  } = useSalesController();

  const StatusBadge = ({ status, color }: { status: string; color: string }) => (
    <View style={[styles.badge, { backgroundColor: color + '15', borderColor: color + '30' }]}>
      <Text style={[styles.badgeText, { color }]}>{status}</Text>
    </View>
  );

  const renderHeader = () => (
    <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.header}>
      <View style={[styles.headerInner, { maxWidth: contentMaxWidth, alignSelf: 'center' }]}>
        <View>
          <Text style={styles.breadcrumb}>Dashboard / <Text style={{ color: COLORS.primary }}>Sales History</Text></Text>
          <Text style={styles.title}>Sales Records</Text>
        </View>
        <View style={styles.headerActions}>
          {isTablet && (
            <CustomButton
              title="Reset Filters"
              onPress={resetFilters}
              variant="secondary"
              size="small"
              iconComponent={<FontAwesome6 name="filter-circle-xmark" size={14} color={COLORS.posRed} />}
            />
          )}
          <CustomButton
            title="Refresh"
            onPress={onRefresh}
            variant="secondary"
            size="small"
            iconComponent={<FontAwesome6 name="rotate" size={14} color={COLORS.primary} />}
          />
        </View>
      </View>
    </LinearGradient>
  );

  const renderFilters = () => (
    <View style={[
      styles.filterSection,
      { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
      (!isTablet && !isLandscape) && styles.filterSectionMobile,
    ]}>
      <View style={[styles.filterItem, !isTablet && !isLandscape && { width: '48.5%' }]}>
        <CustomDropdown
          options={[
            { label: "Sales Records", value: "sale" },
            { label: "Sample Records", value: "sample" }
          ]}
          selectedValue={filters.saleType}
          onValueChange={(val) => setFilter('saleType', val)}
          placeholder="Select Type"
        />
      </View>

      <View style={[styles.searchContainer, !isTablet && !isLandscape && { width: '48.5%' }]}>
        <FontAwesome6 name="magnifying-glass" size={14} color={COLORS.greyText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Invoice #"
          placeholderTextColor={COLORS.greyText}
          value={filters.invoiceNo}
          onChangeText={(val) => setFilter('invoiceNo', val)}
        />
      </View>

      <View style={[styles.dateContainer, !isTablet && !isLandscape && { width: '48.5%' }]}>
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={COLORS.greyText}
          value={filters.date || ''}
          onChangeText={(val) => setFilter('date', val)}
        />
        <FontAwesome6 name="calendar-days" size={14} color={COLORS.primary} />
      </View>

      <View style={[styles.filterItem, !isTablet && !isLandscape && { width: '48.5%' }, (isTablet || isLandscape) && { flex: 1.5 }]}>
        <CustomDropdown
          options={[
            { label: "All Customers", value: "" },
            ...customers.map((c: any) => ({ label: c.name, value: String(c.customer_id) }))
          ]}
          selectedValue={filters.customerId || ''}
          onValueChange={(val) => setFilter('customerId', val)}
          placeholder="All Customers"
        />
      </View>
    </View>
  );

  const renderPagination = () => {
    if (sales.length === 0 && !isLoading) return null;

    return (
      <View style={styles.paginationContainer}>
        <View style={[styles.paginationInner, { maxWidth: contentMaxWidth, alignSelf: 'center' }]}>
          <CustomButton
            title="Previous"
            onPress={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage || isLoading}
            variant="outline"
            style={[styles.pageButton, !pagination.hasPrevPage && styles.pageButtonDisabled]}
            textStyle={[styles.pageButtonText, !pagination.hasPrevPage && { color: COLORS.greyText }]}
            iconComponent={<FontAwesome6 name="chevron-left" size={12} color={!pagination.hasPrevPage ? COLORS.greyText : COLORS.primary} />}
          />

          <View style={styles.pageIndicator}>
            <Text style={styles.pageInfoText}>
              Page <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{pagination.currentPage}</Text>
            </Text>
            {pagination.totalRecords > 0 && <Text style={styles.totalRecordsText}>{pagination.totalRecords} Records Found</Text>}
          </View>

          <CustomButton
            title="Next"
            onPress={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage || isLoading}
            variant="outline"
            style={[styles.pageButton, !pagination.hasNextPage && styles.pageButtonDisabled]}
            textStyle={[styles.pageButtonText, !pagination.hasNextPage && { color: COLORS.greyText }]}
            iconComponent={<FontAwesome6 name="chevron-right" size={12} color={!pagination.hasNextPage ? COLORS.greyText : COLORS.primary} />}
          />
        </View>
      </View>
    );
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeaderRow}>
      <Text style={[styles.columnHeader, { width: 60, textAlign: 'center' }]} numberOfLines={1}>ID</Text>
      <Text style={[styles.columnHeader, { width: 140, textAlign: 'center' }]} numberOfLines={1}>INVOICE</Text>
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>DATE</Text>
      <Text style={[styles.columnHeader, { width: 160, textAlign: 'center' }]} numberOfLines={1}>CUSTOMER</Text>
      <Text style={[styles.columnHeader, { width: 180, textAlign: 'center' }]} numberOfLines={1}>STATUS</Text>
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>TOTAL</Text>
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>PAID</Text>
      <Text style={[styles.columnHeader, { width: 200, textAlign: 'center' }]} numberOfLines={1}>ACTIONS</Text>
    </View>
  );

  const renderTableRow = (item: any, idx: number) => (
    <View key={item.sale_id || idx} style={styles.tableRow}>
      <Text style={[styles.cellText, { width: 60, color: COLORS.greyText, textAlign: 'center' }]} numberOfLines={1}>{item.sale_id}</Text>
      <Text style={[styles.cellText, styles.invoiceText, { width: 140, textAlign: 'center' }]} selectable numberOfLines={1}>{item.invoice_no}</Text>
      <View style={{ width: 100, alignItems: 'center' }}>
        <Text style={[styles.cellText, { textAlign: 'center' }]} numberOfLines={1}>
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
        </Text>
      </View>
      <Text style={[styles.cellText, { width: 160, textAlign: 'center' }]} numberOfLines={1}>{item.customer?.name || 'Walk-in Customer'}</Text>

      <View style={[styles.cell, { width: 180, flexDirection: 'row', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }]}>
        {item.status === 'Fulfilled' && <StatusBadge status="Fulfilled" color={COLORS.posGreen} />}
        {item.status === 'Unfulfilled' && <StatusBadge status="Unfulfilled" color={COLORS.posRed} />}
        {item.payment_status === 'Paid' && <StatusBadge status="Paid" color={COLORS.posGreen} />}
        {item.payment_status === 'Partial' && <StatusBadge status="Partial" color={'#f59e0b'} />}
        {item.payment_status === 'Owing' && <StatusBadge status="Owing" color={COLORS.posRed} />}
        {item.payment_status === 'UnInvoiced' && <StatusBadge status="UnInvoiced" color={COLORS.greyText} />}
        {item.payment_status === 'Invoiced' && <StatusBadge status="Invoiced" color={COLORS.primary} />}
      </View>

      <Text style={[styles.cellText, styles.totalText, { width: 100, textAlign: 'center' }]} numberOfLines={1}>{item.total_bill}</Text>
      <Text style={[styles.cellText, styles.totalText, { width: 100, textAlign: 'center', color: COLORS.posGreen }]} numberOfLines={1}>{item.amount_paid}</Text>

      <View style={[styles.cell, { width: 200, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }]}>
        <View style={styles.actionPickerContainer}>
          <CustomDropdown
            options={[
              { label: "Invoice Slip", value: "Invoice" },
              { label: "Bill Ticket", value: "Ticket" },
              { label: "Delivery GDS", value: "GDS" },
              { label: "Issuance GIS", value: "GIS" },
              ...(item.type === 'sample' ? [{ label: "Sample Slip", value: "Sample" }] : []),
            ]}
            selectedValue=""
            onValueChange={(val) => handleAction(val, item)}
            placeholder="Quick View"
            style={styles.actionPickerBtn}
            textStyle={{ fontSize: 12 }}
            iconColor={COLORS.greyText}
          />
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
            <View style={{ minWidth: 1050, flex: 1 }}>
              {renderTableHeader()}
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true}>
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
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>

      {renderPagination()}
    </View>
  );
};

export default SalesScreen;
