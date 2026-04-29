import { useState, useEffect } from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAccountStore } from '../../../store/useAccountStore';
import { useShiftStore } from '../../../store/useShiftStore';
import { useUIStore } from '../../../store/useUIStore';

export const usePOSExpenseController = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const accountHeads = useAccountStore((state) => state.accountHeads);
  const purchaseOrders = useAccountStore((state) => state.purchaseOrders);
  const cashAccounts = useAccountStore((state) => state.cashAccounts);
  const fetchAccountHeads = useAccountStore((state) => state.fetchAccountHeads);
  const fetchPurchaseOrders = useAccountStore((state) => state.fetchPurchaseOrders);
  const addPOSExpense = useShiftStore((state) => state.addPOSExpense);
  const setScreen = useUIStore((state) => state.setScreen);

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    head_id: '',
    account_no: '',
    amount: '',
    payment_method: 'cash',
    payment_account: '',
    date: new Date(),
    note: '',
    po: '',
  });

  const [attachment, setAttachment] = useState<any>(null);

  useEffect(() => {
    fetchAccountHeads();
    fetchPurchaseOrders();
  }, []);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setAttachment(result.assets[0]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const headsList = accountHeads || [];
  const poList = purchaseOrders || [];
  const accountsList = cashAccounts || [];

  const selectedHead = headsList.find(h => h.id.toString() === formData.head_id);
  const isAccountsPayable = selectedHead?.name === 'Accounts Payable';

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const handleSubmit = async () => {
    if (!formData.head_id || !formData.amount) {
      alert('Please fill in required fields (Head and Amount)');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        date: formData.date.toISOString().split('T')[0],
        deposit_slip_file: attachment,
        deposit_slip_filename: attachment?.name,
      };
      const success = await addPOSExpense(submitData);
      if (success) {
        alert('Expense recorded successfully');
        setScreen('DEFAULT');
      } else {
        alert('Failed to record expense');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    isTablet,
    loading,
    showDatePicker,
    formData,
    attachment,
    headsList,
    poList,
    accountsList,
    selectedHead,
    isAccountsPayable,

    // Actions
    setFormData,
    setShowDatePicker,
    handlePickDocument,
    onDateChange,
    handleSubmit,
    setScreen,
  };
};
