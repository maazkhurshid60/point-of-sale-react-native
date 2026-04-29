import { useState, useEffect } from 'react';
import { useWindowDimensions, Alert } from 'react-native';
import { useShiftStore } from '../../../store/useShiftStore';
import { useAccountStore } from '../../../store/useAccountStore';
import { useUIStore } from '../../../store/useUIStore';

export const usePOSSettingsController = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const currentShift = useShiftStore((s) => s.currentShift);
  const updateSalesman = useShiftStore((s) => s.updateSalesman);
  const updateDefaultAccounts = useAccountStore((s) => s.updateDefaultAccounts);
  const fetchBankAccounts = useAccountStore((s) => s.fetchBankAccounts);
  const fetchCashAccounts = useAccountStore((s) => s.fetchCashAccounts);
  const fetchCreditCardAccounts = useAccountStore((s) => s.fetchCreditCardAccounts);
  const setScreen = useUIStore((state) => state.setScreen);

  const [loading, setLoading] = useState(false);
  const [cashAccounts, setCashAccounts] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [cardAccounts, setCardAccounts] = useState<any[]>([]);
  const [salesmen, setSalesmen] = useState<any[]>([]);

  const [selectedCashId, setSelectedCashId] = useState<number | string>(currentShift?.default_cash_account || '');
  const [selectedBankId, setSelectedBankId] = useState<number | string>(currentShift?.default_bank_account || '');
  const [selectedCardId, setSelectedCardId] = useState<number | string>(currentShift?.default_card_account || '');
  const [fbrEnabled, setFbrEnabled] = useState<boolean>(currentShift?.fbr_sales_enabled || false);
  const [selectedSalesmanId, setSelectedSalesmanId] = useState<number | string>(currentShift?.salesman_id || '');

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    setLoading(true);
    try {
      const [cash, bank, card] = await Promise.all([
        fetchCashAccounts(),
        fetchBankAccounts(),
        fetchCreditCardAccounts(),
      ]);
      setCashAccounts(cash);
      setBankAccounts(bank);
      setCardAccounts(card);
    } catch (e) {
      console.error('Failed to load settings options', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDefaults = async () => {
    setLoading(true);
    try {
      const success = await updateDefaultAccounts(
        selectedCashId,
        selectedBankId,
        selectedCardId,
        fbrEnabled,
        currentShift?.shift_id ?? 0
      );
      if (success) {
        Alert.alert('Success', 'Default accounts updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update defaults');
      }
    } catch (e) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSalesman = async () => {
    if (!selectedSalesmanId) return;
    setLoading(true);
    try {
      const success = await updateSalesman('', Number(selectedSalesmanId));
      if (success) {
        Alert.alert('Success', 'Captain settings updated');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update Captain');
    } finally {
      setLoading(false);
    }
  };

  return {
    isTablet,
    loading,
    cashAccounts,
    bankAccounts,
    cardAccounts,
    salesmen,
    selectedCashId,
    selectedBankId,
    selectedCardId,
    fbrEnabled,
    selectedSalesmanId,
    setSelectedCashId,
    setSelectedBankId,
    setSelectedCardId,
    setFbrEnabled,
    setSelectedSalesmanId,
    handleUpdateDefaults,
    handleUpdateSalesman,
    setScreen,
  };
};
