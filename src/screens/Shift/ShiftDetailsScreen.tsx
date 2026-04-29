import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';
import { CustomButton } from '../../components/common/CustomButton';
import { LinearGradient } from 'expo-linear-gradient';
import { useShiftController } from './hooks/useShiftController';
import { styles } from './ShiftDetailsScreen.styles';

const StatCard = ({ label, value, color, icon, bgColor }: { label: string; value: string | number; color?: string; icon: string; bgColor?: string }) => (
  <View style={[styles.statCard, bgColor ? { backgroundColor: bgColor } : null]}>
    <View style={styles.statIconContainer}>
      <FontAwesome6 name={icon} size={20} color={color || COLORS.primary} />
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: color || COLORS.textDark }]}>
        {typeof value === 'number' ? value.toFixed(2) : value}
      </Text>
    </View>
    <View style={styles.statWatermark}>
      <FontAwesome6 name={icon} size={40} color={color || COLORS.primary} style={{ opacity: 0.05 }} />
    </View>
  </View>
);

const BreakdownTable = ({ title, total, bank, card, cash, icon }: { title: string; total: any; bank: any; card: any; cash: any; icon: string }) => (
  <View style={styles.tableContainer}>
    <View style={styles.tableHeader}>
      <View style={styles.tableHeaderLeft}>
        <View style={styles.tableHeaderIconBox}>
          <FontAwesome6 name={icon} size={14} color={COLORS.primary} />
        </View>
        <Text style={styles.tableTitle}>{title}</Text>
      </View>
      <Text style={styles.tableTotal}>{total || '£ 0.00'}</Text>
    </View>
    <View style={styles.tableBody}>
      <View style={styles.tableRow}>
        <View style={styles.rowLead}>
          <FontAwesome6 name="building-columns" size={10} color="#94A3B8" />
          <Text style={styles.rowLabel}>Bank</Text>
        </View>
        <Text style={styles.rowValue}>{bank || '£ 0.00'}</Text>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.rowLead}>
          <FontAwesome6 name="credit-card" size={10} color="#94A3B8" />
          <Text style={styles.rowLabel}>Card</Text>
        </View>
        <Text style={styles.rowValue}>{card || '£ 0.00'}</Text>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.rowLead}>
          <FontAwesome6 name="money-bill-1" size={10} color="#94A3B8" />
          <Text style={styles.rowLabel}>Cash</Text>
        </View>
        <Text style={styles.rowValue}>{cash || '£ 0.00'}</Text>
      </View>
    </View>
  </View>
);

export const ShiftDetailsScreen: React.FC = () => {
  const {
    isTablet,
    isLandscape,
    contentMaxWidth,
    currentShift,
    currentUser,
    currentShiftData,
    loading,
    isError,
    setScreen,
    showDialog,
    refetch,
  } = useShiftController();

  if (loading || (currentShift?.shift_id && !currentShiftData)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Fetching Shift Details...</Text>
      </View>
    );
  }

  if (!currentShift) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesome6 name="power-off" size={48} color={COLORS.greyText} />
        <Text style={styles.errorText}>No Active Shift Found</Text>
        <Text style={styles.errorSubtitle}>You need to open a shift to see performance data.</Text>
        <CustomButton
          title="Back to Dashboard"
          onPress={() => setScreen('DEFAULT')}
          style={{ marginTop: 24, width: 200 }}
          variant="primary"
          size="large"
        />
      </View>
    );
  }

  if (!currentShiftData || !currentShiftData.success || isError || !currentShiftData.result) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesome6 name="triangle-exclamation" size={48} color={COLORS.greyText} />
        <Text style={styles.errorText}>Syncing Failed</Text>
        <Text style={styles.errorSubtitle}>
          {currentShiftData?.message || "We found your shift but couldn't load the breakdown."}
        </Text>
        <CustomButton
          title="Retry Sync"
          onPress={() => refetch()}
          style={{ marginTop: 20, width: 200 }}
          variant="primary"
        />
        <CustomButton
          title="Back to Dashboard"
          onPress={() => setScreen('DEFAULT')}
          style={{ marginTop: 10, width: 200 }}
          variant="secondary"
        />
      </View>
    );
  }

  const { result: shift, row1, row2, row3, row4 } = currentShiftData;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.header}>
        <View style={[styles.headerInner, { maxWidth: contentMaxWidth, alignSelf: 'center' }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('DEFAULT')}>
            <FontAwesome6 name="arrow-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Shift Details</Text>
            <Text style={styles.subtitle}>Real-time performance summary</Text>
          </View>
          {isTablet && (
            <CustomButton
              title="Sync Now"
              onPress={() => refetch()}
              variant="secondary"
              size="small"
              iconComponent={<FontAwesome6 name="rotate" size={14} color={COLORS.primary} />}
            />
          )}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { alignSelf: 'center', width: '100%', maxWidth: contentMaxWidth }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.infoBar,
          (isTablet || isLandscape) && styles.infoBarTablet,
          !isTablet && isLandscape && { flexWrap: 'wrap' }
        ]}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}><FontAwesome6 name="clock" size={12} color={COLORS.primary} /></View>
            <View>
              <Text style={styles.infoLabel}>Opened at</Text>
              <Text style={styles.infoValue}>{shift?.created_date || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}><FontAwesome6 name="user-tie" size={12} color={COLORS.primary} /></View>
            <View>
              <Text style={styles.infoLabel}>Owner</Text>
              <Text style={styles.infoValue}>{shift?.shiftuser || currentUser?.username || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}><FontAwesome6 name="id-card" size={12} color={COLORS.primary} /></View>
            <View>
              <Text style={styles.infoLabel}>ID</Text>
              <Text style={styles.infoValue}>#{shift?.shift_id || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View style={[
          styles.statsGrid,
          isTablet && styles.statsGridTablet,
          isLandscape && !isTablet && { flexWrap: 'nowrap' }
        ]}>
          <View style={[styles.statCardWrapper, !isTablet && !isLandscape && { width: '100%' }]}>
            <StatCard
              label="Total Sales"
              value={shift?.sale || "0.00"}
              color={COLORS.posGreen}
              icon="cart-shopping"
            />
          </View>
          <View style={[styles.statCardWrapper, !isTablet && !isLandscape && { width: '48%' }]}>
            <StatCard
              label="Transactions"
              value={shift?.Transactions || 0}
              color={COLORS.primary}
              icon="receipt"
            />
          </View>
          <View style={[styles.statCardWrapper, !isTablet && !isLandscape && { width: '48%' }]}>
            <StatCard
              label="Sold Qty"
              value={shift?.Soldquantity || 0}
              color="#F59E0B"
              icon="box-open"
            />
          </View>
        </View>

        <View style={[
          styles.tablesGrid,
          (isTablet || isLandscape) && styles.tablesGridTablet
        ]}>
          <BreakdownTable
            title="Payments"
            icon="money-check-dollar"
            total={row1?.['1']}
            bank={row2?.['1']}
            card={row3?.['1']}
            cash={row4?.['1']}
          />
          <BreakdownTable
            title="Refunds"
            icon="rotate-left"
            total={row1?.['2']}
            bank={row2?.['2']}
            card={row3?.['2']}
            cash={row4?.['2']}
          />
          <BreakdownTable
            title="Coupons"
            icon="ticket"
            total={row1?.['3']}
            bank={row2?.['3']}
            card={row3?.['3']}
            cash={row4?.['3']}
          />
        </View>

        <View style={styles.financialSection}>
          <Text style={styles.sectionHeading}>Financial Summary</Text>
          <View style={[styles.financeGrid, (!isTablet && !isLandscape) && styles.financeGridMobile]}>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Expenses</Text>
              <Text style={[styles.financeValue, { color: COLORS.posRed }]}>{shift?.ExpenseAmount || '£ 0.00'}</Text>
            </View>
            {(isTablet || isLandscape) && <View style={styles.financeDivider} />}
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Payables</Text>
              <Text style={styles.financeValue}>{shift?.PayablePayments || '£ 0.00'}</Text>
            </View>
            {(isTablet || isLandscape) && <View style={styles.financeDivider} />}
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Expected</Text>
              <Text style={[styles.financeValue, { color: COLORS.primary }]}>{shift?.ExpectedAmount || '£ 0.00'}</Text>
            </View>
            {(isTablet || isLandscape) && <View style={styles.financeDivider} />}
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Cash in Hand</Text>
              <Text style={[styles.financeValue, { color: COLORS.posGreen, fontSize: isTablet ? 20 : 18 }]}>{shift?.CashInHand || '£ 0.00'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={[
          styles.cashFlowSection,
          (!isTablet && !isLandscape) && styles.cashFlowSectionMobile
        ]}>
          <View style={styles.cashFlowItem}>
            <FontAwesome6 name="vault" size={18} color={COLORS.primary} style={{ marginBottom: 10 }} />
            <Text style={styles.cashFlowLabel}>Opening</Text>
            <Text style={[styles.cashFlowValue, { color: COLORS.primary }]}>{shift?.OpeningAmount || '£ 0.00'}</Text>
          </View>
          {(isTablet || isLandscape) && <View style={styles.cashFlowDivider} />}
          <View style={styles.cashFlowItem}>
            <FontAwesome6 name="arrow-trend-up" size={18} color={COLORS.posGreen} style={{ marginBottom: 10 }} />
            <Text style={styles.cashFlowLabel}>Paid In</Text>
            <Text style={[styles.cashFlowValue, { color: COLORS.posGreen }]}>{shift?.PaidIn || '£ 0.00'}</Text>
          </View>
          {(isTablet || isLandscape) && <View style={styles.cashFlowDivider} />}
          <View style={styles.cashFlowItem}>
            <FontAwesome6 name="arrow-trend-down" size={18} color={COLORS.posRed} style={{ marginBottom: 10 }} />
            <Text style={styles.cashFlowLabel}>Paid Out</Text>
            <Text style={[styles.cashFlowValue, { color: COLORS.posRed }]}>{shift?.PaidOut || '£ 0.00'}</Text>
          </View>
        </View>

        <View style={[
          styles.actionsBox,
          (isTablet || isLandscape) && styles.actionsBoxTablet
        ]}>
          <CustomButton
            title="Daily Report"
            onPress={() => setScreen('DAILY_REPORT')}
            variant="primary"
            size="large"
            iconComponent={<FontAwesome6 name="file-invoice" size={18} color="white" />}
            style={[!isTablet && { width: '48%' }, isTablet && { flex: 1, marginHorizontal: 5 }]}
          />
          <CustomButton
            title="Cash Mgmt"
            onPress={() => showDialog('CASH_MANAGEMENT', {})}
            variant="primary"
            size="large"
            iconComponent={<FontAwesome6 name="money-bill-transfer" size={18} color="white" />}
            style={[!isTablet && { width: '48%' }, isTablet && { flex: 1, marginHorizontal: 5 }]}
          />
          <CustomButton
            title="Close Shift"
            onPress={() => showDialog('CLOSE_SHIFT', {})}
            variant="danger"
            size="large"
            iconComponent={<FontAwesome6 name="power-off" size={18} color="white" />}
            style={[!isTablet && { width: '100%', marginTop: 10 }, isTablet && { flex: 1, marginHorizontal: 5 }]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShiftDetailsScreen;
