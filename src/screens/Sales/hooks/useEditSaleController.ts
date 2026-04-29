import { useState } from 'react';
import { Alert, useWindowDimensions } from 'react-native';
import { useSalesStore } from '../../../store/useSalesStore';
import { useUIStore } from '../../../store/useUIStore';
import { useAccountStore } from '../../../store/useAccountStore';

export const useEditSaleController = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const setScreen = useUIStore((state) => state.setScreen);
  const accountStore = useAccountStore();

  const {
    currentlySelectedSale,
    returnProductsList,
    paymentsList,
    isLoading,
    addReturnProduct,
    removeReturnProduct,
    updateReturnProduct,
    updateAdjustment,
    newAdjustment,
    makeReturnSale,
    totalTax,
    totalDiscount,
    totalBill,
    totalPaid,
    totalBalance,
    notes,
    setNotes,
    addPaymentMethod,
    updatePayment,
    removePayment,
    searchProductBySku,
    resetEditSale
  } = useSalesStore();

  const [skuSearch, setSkuSearch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState<number | null>(null);
  const [couponStatus, setCouponStatus] = useState<Record<number, { loading: boolean, valid: boolean, message: string }>>({});

  const handleValidateCoupon = async (idx: number, code: string) => {
    if (!code.trim()) return;
    setCouponStatus(prev => ({ ...prev, [idx]: { loading: true, valid: false, message: 'Validating...' } }));
    const coupon = await accountStore.validateCoupon(code.trim());
    if (coupon) {
      setCouponStatus(prev => ({ ...prev, [idx]: { loading: false, valid: true, message: 'Valid!' } }));
      updatePayment(idx, 'amount', Number(coupon.coupon_amount_left) || 0);
    } else {
      setCouponStatus(prev => ({ ...prev, [idx]: { loading: false, valid: false, message: 'Invalid' } }));
    }
  };

  const handleUpdate = async () => {
    const success = await makeReturnSale(currentlySelectedSale!.sale_id);
    if (success) {
      resetEditSale();
      setScreen('SALES');
    } else {
      Alert.alert('Error', 'Failed to update sale.');
    }
  };

  const handleBack = () => {
    resetEditSale();
    setScreen('SALES');
  };

  return {
    isTablet,
    setScreen,
    accountStore,
    currentlySelectedSale,
    returnProductsList,
    paymentsList,
    isLoading,
    addReturnProduct,
    removeReturnProduct,
    updateReturnProduct,
    updateAdjustment,
    newAdjustment,
    totalTax,
    totalDiscount,
    totalBill,
    totalPaid,
    totalBalance,
    notes,
    setNotes,
    addPaymentMethod,
    updatePayment,
    removePayment,
    searchProductBySku,
    skuSearch,
    setSkuSearch,
    showDatePicker,
    setShowDatePicker,
    editingPaymentIndex,
    setEditingPaymentIndex,
    couponStatus,
    handleValidateCoupon,
    handleUpdate,
    handleBack,
  };
};
