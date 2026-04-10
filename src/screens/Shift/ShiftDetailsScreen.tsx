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

const StatCard = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color: color || COLORS.textDark }]}>
      {typeof value === 'number' ? value.toFixed(2) : value}
    </Text>
  </View>
);

const BreakdownTable = ({ title, total, bank, card, cash }: { title: string; total: any; bank: any; card: any; cash: any }) => (
  <View style={styles.tableContainer}>
    <View style={styles.tableHeader}>
      <Text style={styles.tableTitle}>{title}</Text>
      <Text style={styles.tableTotal}>{total || '£ 0.00'}</Text>
    </View>
    <View style={styles.tableBody}>
      <View style={styles.tableRow}>
        <Text style={styles.rowLabel}>Bank</Text>
        <Text style={styles.rowValue}>{bank || '£ 0.00'}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.rowLabel}>Card</Text>
        <Text style={styles.rowValue}>{card || '£ 0.00'}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.rowLabel}>Cash</Text>
        <Text style={styles.rowValue}>{cash || '£ 0.00'}</Text>
      </View>
    </View>
  </View>
);

export const ShiftDetailsScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const currentShift = useAuthStore((state) => state.currentShift);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setScreen = useUIStore((state) => state.setScreen);
  const showDialog = useDialogStore((state) => state.showDialog);

  // TanStack Query for shift details
  const { data: currentShiftData, isLoading: loading, refetch } = useShiftDetails(currentShift?.shift_id);
  console.log("data of the shift details", currentShiftData);
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Fetching Shift Details...</Text>
      </View>
    );
  }

  if (!currentShiftData || !currentShiftData.success) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesome6 name="triangle-exclamation" size={48} color={COLORS.greyText} />
        <Text style={styles.errorText}>No active shift record available</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Refresh Data</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('DEFAULT')}>
          <FontAwesome6 name="arrow-left" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Shift Details</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SHIFT OVERVIEW ROW */}
        <View style={[styles.infoBar, isTablet && styles.infoBarTablet]}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Shift Opened at:</Text>
            <Text style={styles.infoValue}>{shift?.created_date || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Shift Owner:</Text>
            <Text style={styles.infoValue}>{shift?.shiftuser || currentUser?.username || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Shift ID:</Text>
            <Text style={styles.infoValue}>#{shift?.shift_id || 'N/A'}</Text>
          </View>
        </View>

        {/* TOP LEVEL STATS */}
        <View style={[styles.statsGrid, isTablet && styles.statsGridTablet]}>
          <View style={[styles.statCardWrapper, !isTablet && { width: '100%' }]}>
            <StatCard label="Sales" value={shift?.sale || "0.00"} color={COLORS.posGreen} />
          </View>
          <View style={[styles.statCardWrapper, !isTablet && { width: '48%' }]}>
            <StatCard label="Transactions" value={shift?.Transactions || 0} />
          </View>
          <View style={[styles.statCardWrapper, !isTablet && { width: '48%' }]}>
            <StatCard label="Sold Quantity" value={shift?.Soldquantity || 0} />
          </View>
        </View>

        {/* BREAKDOWN SECTION */}
        <View style={[styles.tablesGrid, isTablet && styles.tablesGridTablet]}>
          <BreakdownTable
            title="Payments"
            total={row1?.['1']}
            bank={row2?.['1']}
            card={row3?.['1']}
            cash={row4?.['1']}
          />
          <BreakdownTable
            title="Refund"
            total={row1?.['2']}
            bank={row2?.['2']}
            card={row3?.['2']}
            cash={row4?.['2']}
          />
          <BreakdownTable
            title="Coupon Sales"
            total={row1?.['3']}
            bank={row2?.['3']}
            card={row3?.['3']}
            cash={row4?.['3']}
          />
        </View>

        {/* FINANCIAL SUMMARY SECTION */}
        <View style={styles.financialSection}>
          <View style={[styles.financeGrid, !isTablet && styles.financeGridMobile]}>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Expense Amount</Text>
              <Text style={[styles.financeValue, { color: COLORS.posRed }]}>{shift?.ExpenseAmount || '£ 0.00'}</Text>
            </View>
            {isTablet && <View style={styles.financeDivider} />}
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Payable Payments</Text>
              <Text style={styles.financeValue}>{shift?.PayablePayments || '£ 0.00'}</Text>
            </View>
            {isTablet && <View style={styles.financeDivider} />}
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Expected Amount</Text>
              <Text style={[styles.financeValue, { color: COLORS.primary }]}>{shift?.ExpectedAmount || '£ 0.00'}</Text>
            </View>
            {isTablet && <View style={styles.financeDivider} />}
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Cash in Hands</Text>
              <Text style={[styles.financeValue, { color: COLORS.posGreen, fontSize: 18 }]}>{shift?.CashInHand || '£ 0.00'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        {/* CASH FLOW SECTION */}
        <View style={[styles.cashFlowSection, !isTablet && styles.cashFlowSectionMobile]}>
          <View style={styles.cashFlowItem}>
            <Text style={styles.cashFlowLabel}>Opening Amount</Text>
            <Text style={[styles.cashFlowValue, { color: COLORS.primary }]}>{shift?.OpeningAmount || '£ 0.00'}</Text>
          </View>
          {isTablet && <View style={styles.cashFlowDivider} />}
          <View style={styles.cashFlowItem}>
            <Text style={styles.cashFlowLabel}>Paid In</Text>
            <Text style={[styles.cashFlowValue, { color: COLORS.posGreen }]}>{shift?.PaidIn || '£ 0.00'}</Text>
          </View>
          {isTablet && <View style={styles.cashFlowDivider} />}
          <View style={styles.cashFlowItem}>
            <Text style={styles.cashFlowLabel}>Paid Out</Text>
            <Text style={[styles.cashFlowValue, { color: COLORS.posRed }]}>{shift?.PaidOut || '£ 0.00'}</Text>
          </View>
        </View>

        {/* BOTTOM ACTION BUTTONS */}
        <View style={[styles.actionsBox, isTablet && styles.actionsBoxTablet]}>
          <TouchableOpacity
            style={[styles.actionBtn, !isTablet && { flex: 1 }]}
            onPress={() => setScreen('DAILY_REPORT')}
          >
            <FontAwesome6 name="file-invoice" size={16} color="white" />
            <Text style={styles.actionBtnText}>Daily Cash Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, !isTablet && { flex: 1 }]}
            onPress={() => showDialog('CASH_MANAGEMENT', {})}
          >
            <FontAwesome6 name="money-bill-transfer" size={16} color="white" />
            <Text style={styles.actionBtnText}>Cash Management</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.closeShiftBtn, !isTablet && { width: '100%' }]}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    zIndex: 10,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  infoBar: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 15,
    marginBottom: 20,
    gap: 12,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoBarTablet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#64748B',
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
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  statValue: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 22,
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
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 15,
    color: COLORS.textDark,
  },
  tableTotal: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 15,
    color: COLORS.primary,
  },
  tableBody: {
    padding: 16,
    gap: 12,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: '#64748B',
  },
  rowValue: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 13,
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
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cashFlowItem: {
    flex: 1,
    alignItems: 'center',
  },
  cashFlowLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
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
    height: 35,
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
    borderRadius: 12,
    gap: 10,
    flexGrow: 1,
    minWidth: 160,
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
