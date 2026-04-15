import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useDialogStore } from '../../store/useDialogStore';
import { useShiftDetails } from '../../api/queries';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

const { width: screenWidth } = Dimensions.get('window');

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
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  const isLandscape = width > height;
  const isLargeTablet = width > 1024;

  const currentShift = useAuthStore((state) => state.currentShift);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setScreen = useUIStore((state) => state.setScreen);
  const showDialog = useDialogStore((state) => state.showDialog);

  // TanStack Query for shift details
  const { data: currentShiftData, isLoading: loading, refetch, isError } = useShiftDetails(currentShift?.shift_id);

  // If we have a shift in store but query hasn't finished, show loader
  if (loading || (currentShift?.shift_id && !currentShiftData)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Fetching Shift Details...</Text>
      </View>
    );
  }

  // Case: No shift is actually open in the store
  if (!currentShift) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesome6 name="power-off" size={48} color={COLORS.greyText} />
        <Text style={styles.errorText}>No Active Shift Found</Text>
        <Text style={styles.errorSubtitle}>You need to open a shift to see performance data.</Text>
        <TouchableOpacity
          style={[styles.retryBtn, { marginTop: 24 }]}
          onPress={() => setScreen('DEFAULT')}
        >
          <Text style={styles.retryText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Case: Shift exists but the specific details API failed (rare error or network issue)
  if (!currentShiftData || !currentShiftData.success || isError || !currentShiftData.result) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesome6 name="triangle-exclamation" size={48} color={COLORS.greyText} />
        <Text style={styles.errorText}>Syncing Failed</Text>
        <Text style={styles.errorSubtitle}>
          {currentShiftData?.message || "We found your shift but couldn't load the breakdown."}
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry Sync</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: COLORS.greyText, marginTop: 10 }]}
          onPress={() => setScreen('DEFAULT')}
        >
          <Text style={styles.retryText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { result: shift, row1, row2, row3, row4 } = currentShiftData;

  const contentMaxWidth = isLargeTablet ? 1200 : isTablet ? 1000 : '100%';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerInner, { maxWidth: contentMaxWidth, alignSelf: 'center' }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('DEFAULT')}>
            <FontAwesome6 name="arrow-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Shift Details</Text>
            <Text style={styles.subtitle}>Real-time performance summary</Text>
          </View>
          {isTablet && (
            <TouchableOpacity style={styles.refreshBtn} onPress={() => refetch()}>
              <FontAwesome6 name="rotate" size={16} color={COLORS.primary} />
              <Text style={styles.refreshText}>Sync Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { alignSelf: 'center', width: '100%', maxWidth: contentMaxWidth }]}
        showsVerticalScrollIndicator={false}
      >
        {/* SHIFT OVERVIEW ROW */}
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

        {/* TOP LEVEL STATS */}
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

        {/* BREAKDOWN SECTION */}
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

        {/* FINANCIAL SUMMARY SECTION */}
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

        {/* CASH FLOW SECTION */}
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

        {/* BOTTOM ACTION BUTTONS */}
        <View style={[
          styles.actionsBox,
          (isTablet || isLandscape) && styles.actionsBoxTablet
        ]}>
          <TouchableOpacity
            style={[styles.actionBtn, !isTablet && { width: '48%' }]}
            onPress={() => setScreen('DAILY_REPORT')}
          >
            <FontAwesome6 name="file-invoice" size={16} color="white" />
            <Text style={styles.actionBtnText}>Daily Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, !isTablet && { width: '48.5%' }]}
            onPress={() => showDialog('CASH_MANAGEMENT', {})}
          >
            <FontAwesome6 name="money-bill-transfer" size={16} color="white" />
            <Text style={styles.actionBtnText}>Cash Mgmt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.closeShiftBtn, !isTablet && { width: '100%' }, isTablet && { minWidth: 200 }]}
            onPress={() => showDialog('CLOSE_SHIFT', {})}
          >
            <FontAwesome6 name="power-off" size={16} color="white" />
            <Text style={styles.actionBtnText}>Close Shift</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 40,
  },
  loadingText: {
    ...TYPOGRAPHY.montserrat.medium,
    marginTop: 16,
    color: COLORS.greyText,
  },
  errorText: {
    ...TYPOGRAPHY.montserrat.bold,
    marginTop: 16,
    fontSize: 18,
    color: COLORS.textDark,
  },
  errorSubtitle: {
    ...TYPOGRAPHY.montserrat.medium,
    marginTop: 8,
    fontSize: 14,
    color: COLORS.greyText,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
  retryText: {
    color: 'white',
    ...TYPOGRAPHY.montserrat.bold,
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    zIndex: 10,
    width: '100%',
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 22,
    color: '#1E293B',
  },
  subtitle: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  refreshText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 13,
    color: COLORS.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  infoBar: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 15,
    marginBottom: 20,
    gap: 16,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoBarTablet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  infoValue: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: COLORS.textDark,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statsGridTablet: {
    flexWrap: 'nowrap',
  },
  statCardWrapper: {
    flexGrow: 1,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden', // Required for the watermark effect
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
  },
  statWatermark: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    transform: [{ rotate: '15deg' }],
  },
  tablesGrid: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24,
  },
  tablesGridTablet: {
    flexDirection: 'row',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tableHeaderIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tableTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  tableTotal: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 17,
    color: COLORS.primary,
  },
  tableBody: {
    padding: 18,
    gap: 14,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowLabel: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 13,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rowValue: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: COLORS.textDark,
  },
  financialSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeading: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  financeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  financeItem: {
    flex: 1,
    alignItems: 'center',
  },
  financeLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
    textAlign: 'center',
  },
  financeValue: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 15,
    color: COLORS.textDark,
  },
  financeGridMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  financeDivider: {
    width: 1.5,
    height: 40,
    backgroundColor: '#F1F5F9',
  },
  separator: {
    height: 1.5,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  cashFlowSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cashFlowItem: {
    flex: 1,
    alignItems: 'center',
  },
  cashFlowLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  cashFlowValue: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
  },
  cashFlowSectionMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cashFlowDivider: {
    width: 1.5,
    height: 45,
    backgroundColor: '#F1F5F9',
  },
  actionsBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  actionsBoxTablet: {
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 10,
    flexGrow: 1,
    minHeight: 54,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  closeShiftBtn: {
    backgroundColor: COLORS.posRed,
    shadowColor: COLORS.posRed,
  },
  actionBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 14,
  },
});

export default ShiftDetailsScreen;
