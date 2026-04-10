import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { ScreenUtil } from '../../utils/ScreenUtil';

export const POSSettingsScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const {
    currentShift,
    updateDefaultAccounts,
    updateSalesman,
    fetchBankAccounts,
    fetchCashAccounts,
    fetchCreditCardAccounts,
    fetchStoreOptions,
  } = useAuthStore();
  const setScreen = useUIStore((state) => state.setScreen);

  // Local State for Form
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

      // Note: We can add fetchSalesman logic if needed, 
      // for now we use the ones in useAuthStore if available
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
        fbrEnabled
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

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={[styles.sectionContent, isTablet && styles.tabletRow]}>
        {children}
      </View>
    </View>
  );

  const PickerItem = ({ label, value, onValueChange, items, icon }: any) => (
    <View style={[styles.inputContainer, isTablet && styles.tabletInput]}>
      <View style={styles.labelRow}>
        <FontAwesome6 name={icon} size={14} color={COLORS.primary} />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          <Picker.Item label="Select Account" value="" />
          {items.map((item: any) => (
            <Picker.Item
              key={item.id}
              label={item.account_name || item.name}
              value={item.id}
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Navigation */}
        <View style={styles.headerNav}>
          <TouchableOpacity style={styles.backButton} onPress={() => setScreen('DEFAULT')}>
            <FontAwesome6 name="arrow-left" size={20} color={COLORS.primary} />
            <Text style={styles.backText}>Dashboard</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>POS Settings</Text>
        </View>

        <View style={styles.mainCard}>
          {/* Default Accounts */}
          <SettingsSection title="Default Accounts">
            <PickerItem
              label="Cash Account"
              value={selectedCashId}
              onValueChange={setSelectedCashId}
              items={cashAccounts}
              icon="money-bill-1"
            />
            <PickerItem
              label="Bank Account"
              value={selectedBankId}
              onValueChange={setSelectedBankId}
              items={bankAccounts}
              icon="building-columns"
            />
            <PickerItem
              label="Card Account"
              value={selectedCardId}
              onValueChange={setSelectedCardId}
              items={cardAccounts}
              icon="credit-card"
            />

            <View style={[styles.inputContainer, styles.checkboxContainer]}>
              <Checkbox
                value={fbrEnabled}
                onValueChange={setFbrEnabled}
                color={fbrEnabled ? COLORS.primary : undefined}
              />
              <Text style={styles.checkboxLabel}>Enable FBR Sales Integration</Text>
            </View>
          </SettingsSection>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateDefaults}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.updateButtonText}>Update Default Accounts</Text>}
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Other Settings */}
          <SettingsSection title="Other Settings">
            <PickerItem
              label="Captain / Salesman"
              value={selectedSalesmanId}
              onValueChange={setSelectedSalesmanId}
              items={salesmen} // We will populate this from saleman API
              icon="user-tie"
            />
            <View style={[styles.inputContainer, isTablet && styles.tabletInput]}>
              <View style={styles.labelRow}>
                <FontAwesome6 name="table" size={14} color={COLORS.primary} />
                <Text style={styles.inputLabel}>Customer Table</Text>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker style={styles.picker} enabled={false}>
                  <Picker.Item label="Not Connected" value="" />
                </Picker>
              </View>
            </View>
          </SettingsSection>

          <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: '#6C757D' }]}
            onPress={handleUpdateSalesman}
          >
            <Text style={styles.updateButtonText}>Save Other Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  headerNav: {
    width: '100%',
    maxWidth: 900,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  backText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 10,
  },
  headerTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
    color: '#212529',
  },
  mainCard: {
    width: '100%',
    maxWidth: 900,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 16,
  },
  sectionContent: {
    width: '100%',
  },
  tabletRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  tabletInput: {
    width: '48%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkboxLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 15,
    color: '#212529',
    marginLeft: 12,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 30,
  },
});
