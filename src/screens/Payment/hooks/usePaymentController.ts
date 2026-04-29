import { useState } from 'react';
import { useWindowDimensions, Alert } from 'react-native';
import { usePaymentStore } from '../../../store/usePaymentStore';
import { useCartStore } from '../../../store/useCartStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useAccountStore } from '../../../store/useAccountStore';
import { useUIStore } from '../../../store/useUIStore';
import { useDialogStore } from '../../../store/useDialogStore';
import { formatSaleResponseToSlipData } from '../../../utils/invoiceMapping';

export const usePaymentController = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const setScreen = useUIStore((state) => state.setScreen);
  const showDialog = useDialogStore((state) => state.showDialog);
  const authStore = useAuthStore();
  const accountStore = useAccountStore();
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

  // Coupon validation states
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

  const getAccountOptions = (method: string) => {
    const accounts = method === 'Cash' ? accountStore.cashAccounts : accountStore.bankAccounts;
    return [
      { label: 'Select account...', value: 0 },
      ...(accounts || []).map((acc: any) => ({ label: acc.name, value: acc.id })),
    ];
  };

  return {
    // State
    isTablet,
    selectedCustomer,
    totalBill,
    totalPaid,
    totalBalance,
    physicalInvoiceNo,
    invoiceNote,
    invoiceDate,
    paymentMethodsList,
    showDatePicker,
    showSaleDatePicker,
    editingPaymentIndex,
    isProcessing,
    showAddMethodDropdown,
    couponCodes,
    couponStatus,

    // Actions
    setShowDatePicker,
    setShowSaleDatePicker,
    setEditingPaymentIndex,
    setShowAddMethodDropdown,
    setCouponCodes,
    setInvoiceMetadata,
    handleValidateCoupon,
    handleBack,
    handleFinalize,
    getAccountOptions,
    addPaymentMethod,
    updatePaymentMethodAmount,
    updatePaymentMethodAccount,
    updatePaymentMethodRef,
    updatePaymentMethodDate,
    deletePaymentMethod,
    setCouponStatus,
  };
};
