import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { usePaymentStore } from '../../store/usePaymentStore';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useDialogStore } from '../../store/useDialogStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { formatSaleResponseToSlipData } from '../../utils/invoiceMapping';
import { LinearGradient } from 'expo-linear-gradient';

let DateTimePicker: any;
try {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (e) {
  DateTimePicker = null;
}

interface DropdownOption { label: string; value: any }
interface CustomDropdownProps {
  options: DropdownOption[];
  selectedValue: any;
  onSelect: (value: any) => void;
  placeholder?: string;
  style?: any;
  accentColor?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options, selectedValue, onSelect, placeholder = 'Select...', style, accentColor = COLORS.primary
}) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === selectedValue)?.label || placeholder;

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdownTrigger, style]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.dropdownTriggerText, !selectedValue && styles.dropdownPlaceholder]} numberOfLines={1}>
          {selectedLabel}
        </Text>
        <FontAwesome6 name="chevron-down" size={11} color={accentColor} />
      </TouchableOpacity>

      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownModalHeader}>
              <Text style={styles.dropdownModalTitle}>Select Option</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <FontAwesome6 name="xmark" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownOption,
                    item.value === selectedValue && styles.dropdownOptionSelected,
                  ]}
                  onPress={() => { onSelect(item.value); setOpen(false); }}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    item.value === selectedValue && styles.dropdownOptionTextSelected,
                  ]}>
                    {item.label}
                  </Text>
                  {item.value === selectedValue && (
                    <FontAwesome6 name="check" size={14} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

// ─── Main Screen ─────────────────────────────────────────────────────────────
const PaymentScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const setScreen = useUIStore((state) => state.setScreen);
  const showDialog = useDialogStore((state) => state.showDialog);
  const authStore = useAuthStore();
  const selectedCustomer = useCartStore((state) => state.selectedCustomer);

  const {
    totalBill, totalPaid, totalBalance,
    physicalInvoiceNo, invoiceNote, invoiceDate,
    paymentMethodsList,
    addPaymentMethod, updatePaymentMethodAmount, updatePaymentMethodAccount,
    updatePaymentMethodRef, updatePaymentMethodDate, deletePaymentMethod,
    setInvoiceMetadata, makePaymentSale, resetPaymentState, validateCoupon,
  } = usePaymentStore();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSaleDatePicker, setShowSaleDatePicker] = useState(false);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddMethodDropdown, setShowAddMethodDropdown] = useState(false);

  // Coupon validation states: track per-payment row
  const [couponCodes, setCouponCodes] = useState<Record<number, string>>({});
  const [couponStatus, setCouponStatus] = useState<Record<number, { status: 'idle' | 'loading' | 'valid' | 'invalid'; message: string }>>({});

  const handleValidateCoupon = async (paymentId: number) => {
    const code = couponCodes[paymentId] || '';
    if (!code.trim()) {
      setCouponStatus(prev => ({ ...prev, [paymentId]: { status: 'invalid', message: 'Enter a coupon code first.' } }));
      return;
    }

    setCouponStatus(prev => ({ ...prev, [paymentId]: { status: 'loading', message: 'Validating...' } }));

    const result = await validateCoupon(paymentId, code);

    if (result.success) {
      setCouponStatus(prev => ({
        ...prev,
        [paymentId]: { status: 'valid', message: `✓ ${result.message} — £${result.amount?.toFixed(2)}` },
      }));
    } else {
      setCouponStatus(prev => ({
        ...prev,
        [paymentId]: { status: 'invalid', message: result.message },
      }));
    }
  };

  const methodOptions: DropdownOption[] = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Bank Transfer', value: 'Bank' },
    { label: 'Credit Card', value: 'Card' },
    { label: 'Coupon / Voucher', value: 'Coupon' },
    { label: 'Other', value: 'Other' },
  ];

  const getAccountOptions = (method: string): DropdownOption[] => {
    const accounts = method === 'Cash' ? authStore.cashAccounts : authStore.bankAccounts;
    return [
      { label: 'Select account...', value: 0 },
      ...(accounts || []).map((acc: any) => ({ label: acc.name, value: acc.id })),
    ];
  };

  const handleBack = () => {
    resetPaymentState();
    setScreen('POS_BILLING');
  };

  const handleFinalize = async (type: string) => {
    if (totalBalance > 0.01) {
      Alert.alert('Incomplete Payment', 'Balance must be fully settled to complete the sale.', [{ text: 'OK' }]);
      return;
    }
    setIsProcessing(true);
    const result = await makePaymentSale(type);
    setIsProcessing(false);

    if (!result) {
      Alert.alert('Transaction Failed', `Could not generate ${type}. Check the console logs for details.`);
      return;
    }

    // Handle walk-in customer block
    if (result.error === 'walk-in') {
      Alert.alert('Not Allowed', result.message || 'Credit Sale not allowed for Walk-in customer.');
      return;
    }

    const slipData = formatSaleResponseToSlipData(result);
    if (!slipData) return;
    if (type === 'print-invoice') {
      showDialog('TICKET_SLIP', { slipData });
    } else {
      showDialog('RAW_BILL_SLIP', { slipData });
    }
    setScreen('POS_BILLING');
  };

  const getBadgeStyle = (method: string) => {
    if (method === 'Cash') return styles.badgeCash;
    if (method === 'Bank') return styles.badgeBank;
    if (method === 'Coupon') return styles.badgeCoupon;
    if (method === 'Other') return styles.badgeOther;
    return styles.badgeCard;
  };

  const getBadgeIcon = (method: string) => {
    if (method === 'Cash') return 'money-bill';
    if (method === 'Bank') return 'building-columns';
    if (method === 'Coupon') return 'ticket';
    if (method === 'Other') return 'ellipsis';
    return 'credit-card';
  };

  const renderPaymentTable = () => (
    <View style={styles.tableBlock}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: isTablet ? '100%' : 750 }}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.columnHeader, { width: 110 }]}>Method</Text>
            <Text style={[styles.columnHeader, { width: 160 }]}>Account</Text>
            <Text style={[styles.columnHeader, { width: 110 }]}>Date</Text>
            <Text style={[styles.columnHeader, { width: 120 }]}>Ref / Memo</Text>
            <Text style={[styles.columnHeader, { width: 110, textAlign: 'right' }]}>Amount</Text>
            <View style={{ width: 48 }} />
          </View>

          {/* Rows */}
          {paymentMethodsList.map((p: any) => (
            <View key={`pay-${p.id}`}>
              <View style={styles.tableRow}>
                {/* Method Badge */}
                <View style={[styles.methodBadge, getBadgeStyle(p.method), { width: 110 }]}>
                  <FontAwesome6 name={getBadgeIcon(p.method)} size={11} color="white" />
                  <Text style={styles.methodBadgeText}>{p.method}</Text>
                </View>

                {/* Account Dropdown (hide for Coupon) */}
                <View style={{ width: 160 }}>
                  {p.method === 'Coupon' ? (
                    <View style={[styles.tableCellInput, { justifyContent: 'center' }]}>
                      <Text style={[styles.tableCellText, { color: '#94a3b8' }]}>N/A</Text>
                    </View>
                  ) : (
                    <CustomDropdown
                      options={getAccountOptions(p.method)}
                      selectedValue={p.account_id}
                      onSelect={(val) => updatePaymentMethodAccount(p.id, val)}
                      placeholder="Select account..."
                      style={styles.tableDropdown}
                    />
                  )}
                </View>

                {/* Date picker (hide for Coupon) */}
                {p.method === 'Coupon' ? (
                  <View style={[styles.tableCellInput, { width: 110, justifyContent: 'center' }]}>
                    <Text style={[styles.tableCellText, { color: '#94a3b8' }]}>—</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.tableCellInput, { width: 110, flexDirection: 'row', alignItems: 'center', gap: 6 }]}
                    onPress={() => { setEditingPaymentIndex(p.id); setShowDatePicker(true); }}
                  >
                    <FontAwesome6 name="calendar" size={12} color={COLORS.primary} />
                    <Text style={styles.tableCellText} numberOfLines={1}>
                      {p.date || 'Set date'}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Ref / Coupon Code */}
                {p.method === 'Coupon' ? (
                  <View style={{ width: 120, flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                    <TextInput
                      style={[styles.tableCellInput, { flex: 1, borderColor: couponStatus[p.id]?.status === 'valid' ? '#10b981' : couponStatus[p.id]?.status === 'invalid' ? '#ef4444' : '#e2e8f0' }]}
                      placeholder="Code..."
                      placeholderTextColor="#94a3b8"
                      value={couponCodes[p.id] || ''}
                      onChangeText={(val) => setCouponCodes(prev => ({ ...prev, [p.id]: val }))}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity
                      style={styles.validateBtn}
                      onPress={() => handleValidateCoupon(p.id)}
                      disabled={couponStatus[p.id]?.status === 'loading'}
                    >
                      {couponStatus[p.id]?.status === 'loading' ? (
                        <Text style={styles.validateBtnText}>...</Text>
                      ) : (
                        <FontAwesome6 name="check" size={12} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TextInput
                    style={[styles.tableCellInput, { width: 120 }]}
                    placeholder="TRX-..."
                    placeholderTextColor="#94a3b8"
                    value={p.ref || ''}
                    onChangeText={(val) => updatePaymentMethodRef(p.id, val)}
                  />
                )}

                {/* Amount (disabled for validated coupon) */}
                <TextInput
                  style={[styles.tableCellInput, styles.amountInput, { width: 110, textAlign: 'right' },
                  p.method === 'Coupon' && couponStatus[p.id]?.status === 'valid' && { backgroundColor: '#d1fae5', borderColor: '#10b981' }
                  ]}
                  value={String(p.amount || '')}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#f59e0b"
                  editable={!(p.method === 'Coupon' && couponStatus[p.id]?.status === 'valid')}
                  onChangeText={(val) => updatePaymentMethodAmount(p.id, Number(val) || 0)}
                />

                {/* Delete */}
                <TouchableOpacity
                  style={{ width: 48, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => {
                    deletePaymentMethod(p.id);
                    // Clean up coupon states for this row
                    setCouponCodes(prev => { const n = { ...prev }; delete n[p.id]; return n; });
                    setCouponStatus(prev => { const n = { ...prev }; delete n[p.id]; return n; });
                  }}
                >
                  <View style={styles.deleteIconBg}>
                    <FontAwesome6 name="trash-can" size={13} color="#ef4444" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Coupon status message row */}
              {p.method === 'Coupon' && couponStatus[p.id] && couponStatus[p.id].status !== 'idle' && (
                <View style={styles.couponStatusRow}>
                  <FontAwesome6
                    name={couponStatus[p.id].status === 'valid' ? 'circle-check' : couponStatus[p.id].status === 'invalid' ? 'circle-xmark' : 'spinner'}
                    size={13}
                    color={couponStatus[p.id].status === 'valid' ? '#10b981' : couponStatus[p.id].status === 'invalid' ? '#ef4444' : '#64748b'}
                  />
                  <Text style={[
                    styles.couponStatusText,
                    { color: couponStatus[p.id].status === 'valid' ? '#10b981' : couponStatus[p.id].status === 'invalid' ? '#ef4444' : '#64748b' }
                  ]}>
                    {couponStatus[p.id].message}
                  </Text>
                </View>
              )}
            </View>
          ))}

          {/* Empty state */}
          {paymentMethodsList.length === 0 && (
            <View style={styles.emptyState}>
              <FontAwesome6 name="money-check-dollar" size={42} color="#e2e8f0" />
              <Text style={styles.emptyStateTitle}>No tender added yet</Text>
              <Text style={styles.emptyStateSubtitle}>Use "Add Tender" above to split payment.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.header}>
        <View style={styles.headerTopArea}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <View style={styles.backIconCircle}>
              <FontAwesome6 name="arrow-left" size={14} color="#334155" />
            </View>
            <Text style={styles.backText}>Return</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <Text style={styles.title}>Payment Processing</Text>
            <View style={styles.customerPill}>
              <FontAwesome6 name="user-check" size={11} color={COLORS.primary} />
              <Text style={styles.customerName}>{selectedCustomer}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={isTablet ? styles.tabletLayout : styles.mobileLayout}>

          {/* ── LEFT: Payment Methods ───────────────────────────── */}
          <View style={isTablet ? styles.leftPane : styles.fullPane}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Transaction Splitting</Text>
                <Text style={styles.sectionDesc}>Distribute balance across multiple tender sources.</Text>
              </View>

              {/* Add Tender button (custom dropdown) */}
              <TouchableOpacity
                style={styles.addTenderBtn}
                onPress={() => setShowAddMethodDropdown(true)}
                activeOpacity={0.85}
              >
                <FontAwesome6 name="plus" size={13} color={COLORS.primary} />
                <Text style={styles.addTenderText}>Add Tender</Text>
                <FontAwesome6 name="chevron-down" size={11} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {renderPaymentTable()}
          </View>

          {/* ── RIGHT: Totals + Metadata ────────────────────────── */}
          <View style={isTablet ? styles.rightPane : styles.fullPane}>

            {/* Ledger Card */}
            <LinearGradient colors={[COLORS.primary, '#6b21a8']} style={styles.totalsContainer}>
              <Text style={styles.totalsHeaderText}>FINANCIAL LEDGER</Text>
              <View style={styles.totalsBody}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Grand Total</Text>
                  <Text style={styles.totalValue}>{totalBill.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: '#a7f3d0' }]}>Allocated</Text>
                  <Text style={[styles.totalValue, { color: '#a7f3d0' }]}>{totalPaid.toFixed(2)}</Text>
                </View>
                <View style={[styles.totalRow, styles.totalRowDivider]}>
                  <Text style={[styles.totalLabel, { color: '#fca5a5', fontSize: 17, ...TYPOGRAPHY.montserrat.bold }]}>Balance Due</Text>
                  <Text style={[styles.totalValue, { color: '#fca5a5', fontSize: 22 }]}>{totalBalance.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.cardGlow} />
            </LinearGradient>

            {/* Documentation */}
            <View style={styles.metaContainer}>
              <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 18 }]}>Documentation</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Physical Registration No.</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="#000-0000"
                  placeholderTextColor="#94a3b8"
                  value={physicalInvoiceNo}
                  onChangeText={(val) => setInvoiceMetadata({ physicalInvoiceNo: val })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Accounting Date</Text>
                <TouchableOpacity
                  style={styles.textInputRow}
                  onPress={() => setShowSaleDatePicker(true)}
                >
                  <Text style={{ ...TYPOGRAPHY.montserrat.semiBold, color: '#334155', fontSize: 14 }}>
                    {invoiceDate ? invoiceDate.split('T')[0] : 'Select date'}
                  </Text>
                  <View style={styles.iconBox}>
                    <FontAwesome6 name="calendar-day" size={13} color={COLORS.primary} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Internal Memo</Text>
                <TextInput
                  style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]}
                  placeholder="Compliance notes, customer preferences..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={4}
                  value={invoiceNote}
                  onChangeText={(val) => setInvoiceMetadata({ invoiceNote: val })}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionPanel}>
              <TouchableOpacity
                style={[styles.finalizeBtn, { backgroundColor: COLORS.primary }]}
                onPress={() => handleFinalize('print-invoice')}
                disabled={isProcessing}
              >
                <FontAwesome6 name="file-invoice" size={17} color="white" />
                <Text style={styles.finalizeBtnText}>{isProcessing ? 'Working...' : 'Ticket'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.finalizeBtn, { backgroundColor: '#10b981' }]}
                onPress={() => handleFinalize('print-bill')}
                disabled={isProcessing}
              >
                <FontAwesome6 name="receipt" size={17} color="white" />
                <Text style={styles.finalizeBtnText}>{isProcessing ? 'Working...' : 'Issue Invoice'}</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Add Tender Modal */}
      <Modal transparent animationType="fade" visible={showAddMethodDropdown} onRequestClose={() => setShowAddMethodDropdown(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowAddMethodDropdown(false)}>
          <View style={[styles.dropdownModal, { width: 260 }]}>
            <View style={styles.dropdownModalHeader}>
              <Text style={styles.dropdownModalTitle}>Choose Tender Type</Text>
              <TouchableOpacity onPress={() => setShowAddMethodDropdown(false)}>
                <FontAwesome6 name="xmark" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
            {methodOptions.map((opt) => {
              const iconMap: Record<string, { name: string; color: string }> = {
                Cash: { name: 'money-bill', color: '#10b981' },
                Bank: { name: 'building-columns', color: '#3b82f6' },
                Card: { name: 'credit-card', color: '#8b5cf6' },
                Coupon: { name: 'ticket', color: '#f59e0b' },
                Other: { name: 'ellipsis', color: '#64748b' },
              };
              const icon = iconMap[opt.value] || { name: 'circle-dot', color: '#64748b' };
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={styles.dropdownOption}
                  onPress={() => {
                    const amount = totalBalance > 0 ? totalBalance : 0;
                    addPaymentMethod(opt.value, amount, null);
                    setShowAddMethodDropdown(false);
                  }}
                >
                  <View style={[styles.tenderIconBg, { backgroundColor: icon.color + '22' }]}>
                    <FontAwesome6 name={icon.name as any} size={14} color={icon.color} />
                  </View>
                  <Text style={styles.dropdownOptionText}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* Date Pickers */}
      {showDatePicker && DateTimePicker && (
        <DateTimePicker
          value={
            editingPaymentIndex !== null
              ? new Date(paymentMethodsList.find((p: any) => p.id === editingPaymentIndex)?.date || new Date())
              : new Date()
          }
          mode="date"
          onChange={(_: any, date: Date) => {
            setShowDatePicker(false);
            if (date && editingPaymentIndex !== null) {
              updatePaymentMethodDate(editingPaymentIndex, date.toISOString().split('T')[0]);
            }
            setEditingPaymentIndex(null);
          }}
        />
      )}

      {showSaleDatePicker && DateTimePicker && (
        <DateTimePicker
          value={invoiceDate ? new Date(invoiceDate) : new Date()}
          mode="date"
          onChange={(_: any, date: Date) => {
            setShowSaleDatePicker(false);
            if (date) setInvoiceMetadata({ invoiceDate: date.toISOString() });
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTopArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerRight: { alignItems: 'flex-end' },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  backText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 13, color: '#64748b',
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  title: { ...TYPOGRAPHY.montserrat.bold, fontSize: 22, color: '#0f172a', letterSpacing: -0.5 },
  customerPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ede9fe',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 20, marginTop: 6, gap: 7,
  },
  customerName: { ...TYPOGRAPHY.montserrat.semiBold, fontSize: 13, color: COLORS.primary },

  // Layout
  scrollContent: { padding: 24, paddingBottom: 60 },
  tabletLayout: { flexDirection: 'row', gap: 28 },
  mobileLayout: { flexDirection: 'column', gap: 28 },
  leftPane: { flex: 1.65 },
  rightPane: { flex: 1 },
  fullPane: { width: '100%' },

  // Section header
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: 18,
  },
  sectionTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 18, color: '#1e293b' },
  sectionDesc: { ...TYPOGRAPHY.montserrat.medium, fontSize: 12, color: '#64748b', marginTop: 2 },

  // Add Tender Button
  addTenderBtn: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#eef2ff',
    borderWidth: 1.5, borderColor: '#c7d2fe',
    borderRadius: 12,
  },
  addTenderText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: COLORS.primary },

  // Table
  tableBlock: {
    borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 16, backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingVertical: 12, paddingHorizontal: 18,
    alignItems: 'center', gap: 10,
    borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  columnHeader: {
    ...TYPOGRAPHY.montserrat.bold, fontSize: 11,
    color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
    alignItems: 'center', gap: 10,
  },

  // Method Badge
  methodBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 10,
    borderRadius: 8, gap: 6,
  },
  badgeCash: { backgroundColor: '#10b981' },
  badgeBank: { backgroundColor: '#3b82f6' },
  badgeCard: { backgroundColor: '#8b5cf6' },
  badgeCoupon: { backgroundColor: '#f59e0b' },
  badgeOther: { backgroundColor: '#64748b' },
  methodBadgeText: { ...TYPOGRAPHY.montserrat.bold, color: 'white', fontSize: 12 },

  // Table Inputs
  tableCellInput: {
    height: 38, borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 8, paddingHorizontal: 10,
    backgroundColor: '#f8fafc',
    ...TYPOGRAPHY.montserrat.semiBold, fontSize: 13, color: '#334155',
    justifyContent: 'center',
  },
  tableCellText: { ...TYPOGRAPHY.montserrat.semiBold, fontSize: 12, color: '#334155' },
  tableDropdown: {
    height: 38, borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 8, backgroundColor: '#f8fafc',
  },
  amountInput: {
    backgroundColor: '#fffbeb', borderColor: '#fde68a',
    ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: '#d97706',
  },
  deleteIconBg: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center',
  },
  validateBtn: {
    width: 40, height: 40, borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center', justifyContent: 'center',
  },
  validateBtnText: {
    ...TYPOGRAPHY.montserrat.bold, fontSize: 11, color: 'white',
  },
  couponStatusRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 20, paddingBottom: 10, paddingTop: 2,
  },
  couponStatusText: {
    ...TYPOGRAPHY.montserrat.semiBold, fontSize: 12,
  },

  // Empty state
  emptyState: { paddingVertical: 55, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyStateTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 15, color: '#94a3b8' },
  emptyStateSubtitle: { ...TYPOGRAPHY.montserrat.medium, fontSize: 12, color: '#cbd5e1' },

  // Custom Dropdown
  dropdownTrigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 10, height: 38,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 8, backgroundColor: '#f8fafc', gap: 6,
  },
  dropdownTriggerText: { ...TYPOGRAPHY.montserrat.semiBold, fontSize: 12, color: '#334155', flex: 1 },
  dropdownPlaceholder: { color: '#94a3b8' },
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: 'white', borderRadius: 16,
    minWidth: 280, maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2, shadowRadius: 24, elevation: 16,
    overflow: 'hidden',
    maxHeight: 400,
  },
  dropdownModalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  dropdownModalTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 15, color: '#1e293b' },
  dropdownOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f8fafc',
  },
  dropdownOptionSelected: { backgroundColor: '#f5f3ff' },
  dropdownOptionText: { ...TYPOGRAPHY.montserrat.semiBold, fontSize: 14, color: '#334155', flex: 1 },
  dropdownOptionTextSelected: { color: COLORS.primary },
  tenderIconBg: {
    width: 32, height: 32, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },

  // Totals Card
  totalsContainer: {
    borderRadius: 20, overflow: 'hidden',
    marginBottom: 22, padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
    position: 'relative',
  },
  totalsHeaderText: {
    ...TYPOGRAPHY.montserrat.bold, fontSize: 11,
    color: '#c4b5fd', letterSpacing: 2.5, marginBottom: 22,
  },
  totalsBody: { gap: 14 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalRowDivider: {
    paddingTop: 14, marginTop: 4,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)',
  },
  totalLabel: { ...TYPOGRAPHY.montserrat.medium, fontSize: 14, color: '#e0e7ff' },
  totalValue: { ...TYPOGRAPHY.montserrat.bold, fontSize: 17, color: 'white' },
  cardGlow: {
    position: 'absolute', top: -40, right: -40,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  // Meta Card
  metaContainer: {
    backgroundColor: 'white', borderRadius: 20,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    padding: 22,
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    ...TYPOGRAPHY.montserrat.semiBold, fontSize: 11,
    color: '#64748b', marginBottom: 8,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  textInput: {
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12,
    padding: 13,
    ...TYPOGRAPHY.montserrat.semiBold, fontSize: 14, color: '#334155',
    backgroundColor: '#f8fafc',
  },
  textInputRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12,
    padding: 13, backgroundColor: '#f8fafc',
  },
  iconBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center',
  },

  // Action Buttons
  actionPanel: { flexDirection: 'row', marginTop: 22, gap: 14 },
  finalizeBtn: {
    flex: 1, flexDirection: 'row', height: 54,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  finalizeBtnText: {
    ...TYPOGRAPHY.montserrat.bold, color: 'white', fontSize: 15, letterSpacing: 0.5,
  },
});

export default PaymentScreen;
