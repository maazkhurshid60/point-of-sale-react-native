import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { CustomButton } from '../../components/common/CustomButton';
import { HoldSaleModel } from '../../models';
import { useHoldSalesController } from './hooks/useHoldSalesController';
import { styles } from './HoldSalesScreen.styles';

export const HoldSalesScreen: React.FC = () => {
  const {
    isTablet,
    setScreen,
    holdSales,
    loading,
    nextPageUrl,
    loadHoldSales,
    handleRecall,
    handleDelete,
  } = useHoldSalesController();

  const renderItem = ({ item }: { item: HoldSaleModel }) => {
    if (isTablet) {
      return (
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { flex: 1.5 }]}>{new Date(item.created_at).toLocaleString()}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>Customer #{item.customer_id}</Text>
          <Text style={[styles.cell, { flex: 0.8 }]}>{item.total_bill.toFixed(2)}</Text>
          <Text style={[styles.cell, { flex: 0.8 }]}>{item.actual_bill.toFixed(2)}</Text>
          <Text style={StyleSheet.flatten([styles.cell, { flex: 0.8, color: item.balance > 0 ? COLORS.posRed : COLORS.posGreen }])}>
            {item.balance.toFixed(2)}
          </Text>
          <View style={styles.actionsCell}>
            <CustomButton
              title="Recall"
              onPress={() => handleRecall(item)}
              variant="none"
              size="none"
              style={styles.recallBtn}
              textStyle={styles.btnText}
              iconComponent={<FontAwesome6 name="rotate-left" size={14} color="white" />}
            />
            <CustomButton
              onPress={() => handleDelete(item.sale_id)}
              variant="none"
              size="none"
              style={styles.deleteBtn}
              iconComponent={<FontAwesome6 name="trash" size={14} color="white" />}
            />
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
            <Text style={StyleSheet.flatten([styles.cardValue, { color: item.balance > 0 ? COLORS.posRed : COLORS.posGreen }])}>
              {item.balance.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <CustomButton
            title="Recall POS"
            onPress={() => handleRecall(item)}
            variant="none"
            size="none"
            style={StyleSheet.flatten([styles.actionBtn, styles.recallBtn])}
            textStyle={styles.btnText}
            iconComponent={<FontAwesome6 name="rotate-left" size={14} color="white" />}
          />
          <CustomButton
            title="Delete"
            onPress={() => handleDelete(item.sale_id)}
            variant="none"
            size="none"
            style={StyleSheet.flatten([styles.actionBtn, styles.deleteBtn])}
            textStyle={styles.btnText}
            iconComponent={<FontAwesome6 name="trash" size={14} color="white" />}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomButton
          onPress={() => setScreen('DEFAULT')}
          variant="none"
          size="none"
          style={styles.backBtn}
          textStyle={styles.backText}
          iconComponent={<FontAwesome6 name="arrow-left" size={20} color={COLORS.primary} />}
          title="Back to POS"
        />
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

export default HoldSalesScreen;
