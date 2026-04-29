import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { OfflineSale } from '../../store/useOfflineSalesStore';
import { COLORS } from '../../constants/colors';
import { useOfflineSalesController } from './hooks/useOfflineSalesController';
import { styles } from './OfflineSalesScreen.styles';

const OfflineSalesScreen: React.FC = () => {
  const {
    isTablet,
    sales,
    expandedSaleId,
    isLoading,
    OFFLINE_LIMIT,
    usedPercentage,
    handleDeleteAll,
    syncSale,
    removeOfflineSale,
    toggleExpand,
  } = useOfflineSalesController();

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
          onPress={() => toggleExpand(sale.sale_id)}
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

export default OfflineSalesScreen;
