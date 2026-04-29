import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { CustomButton } from '../../components/common/CustomButton';
import { useOrdersController } from './hooks/useOrdersController';
import { styles } from './OrdersScreen.styles';

export const OrdersScreen: React.FC = () => {
  const {
    isLandscape,
    contentMaxWidth,
    orders,
    isLoading,
    activeDropdownRow,
    pagination,
    setActiveDropdownRow,
    handlePageChange,
    onRefresh,
    handleAction,
  } = useOrdersController();

  const renderHeader = () => (
    <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.header}>
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
    </LinearGradient>
  );

  const renderPagination = () => {
    if (orders.length === 0 && !isLoading) return null;

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
            {pagination.totalRecords > 0 && <Text style={styles.totalRecordsText}>{pagination.totalRecords} Orders Found</Text>}
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
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>DATE</Text>
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>USER</Text>
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>EMPLOYEE</Text>
      <Text style={[styles.columnHeader, { width: 160, textAlign: 'center' }]} numberOfLines={1}>CUSTOMER</Text>
      <Text style={[styles.columnHeader, { width: 80, textAlign: 'center' }]} numberOfLines={1}>STORE</Text>
      <Text style={[styles.columnHeader, { width: 250, textAlign: 'center' }]} numberOfLines={1}>PRODUCTS</Text>
      <Text style={[styles.columnHeader, { width: 80, textAlign: 'center' }]} numberOfLines={1}>QTY</Text>
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>TOTAL BILL</Text>
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>ACTION</Text>
    </View>
  );

  const renderTableRow = (item: any, idx: number) => {
    const productsString = item.order_item?.map((oi: any) => oi.name).join(', ') || '-';
    const customerName = item.customer?.name || 'Walk-in-customer';

    return (
      <View key={item.id || idx} style={styles.tableRow}>
        <Text style={[styles.cellText, { width: 60, textAlign: 'center', color: COLORS.greyText }]} numberOfLines={1}>{item.id}</Text>

        <View style={{ width: 100, alignItems: 'center' }}>
          <Text style={[styles.cellText, { textAlign: 'center' }]} numberOfLines={1}>
            {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
          </Text>
        </View>

        <Text style={[styles.cellText, { width: 100, textAlign: 'center' }]} numberOfLines={1}>{item.salesman?.name || 'Admin'}</Text>
        <Text style={[styles.cellText, { width: 100, textAlign: 'center' }]} numberOfLines={1}>-</Text>
        <Text style={[styles.cellText, { width: 160, textAlign: 'center', color: COLORS.primary }]} numberOfLines={1}>{customerName}</Text>
        <Text style={[styles.cellText, { width: 80, textAlign: 'center' }]} numberOfLines={1}>{item.store_id}</Text>
        <Text style={[styles.cellText, { width: 250, textAlign: 'center' }]} numberOfLines={1}>{productsString}</Text>
        <Text style={[styles.cellText, { width: 80, textAlign: 'center' }]} numberOfLines={1}>{item.total_quantity}</Text>
        <Text style={[styles.cellText, styles.totalText, { width: 100, textAlign: 'center' }]} numberOfLines={1}>{Number(item.total_bill).toLocaleString()}</Text>

        <View style={[styles.cell, { width: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }]}>
          <CustomButton
            title=""
            onPress={() => handleAction('Delete', item)}
            variant="danger"
            size="small"
            style={[styles.deleteBtnCustom, { width: 32, height: 32, borderRadius: 8 }]}
            iconComponent={<FontAwesome6 name="trash-can" size={12} color="white" />}
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
            <View style={{ minWidth: 1150, flex: 1 }}>
              {renderTableHeader()}
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true}>
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
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>

      {renderPagination()}
    </View>
  );
};

export default OrdersScreen;
