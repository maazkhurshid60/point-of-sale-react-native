import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { usePOSSettingsController } from './hooks/usePOSSettingsController';
import { styles } from './POSSettingsScreen.styles';

export const POSSettingsScreen: React.FC = () => {
  const {
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
  } = usePOSSettingsController();

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
          dropdownIconColor={COLORS.primary}
        >
          <Picker.Item label="Select Account" value="" color={COLORS.greyText} />
          {items.map((item: any) => (
            <Picker.Item
              key={item.id}
              label={item.account_name || item.name}
              value={item.id}
              color={COLORS.textDark}
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerNav}>
          <TouchableOpacity style={styles.backButton} onPress={() => setScreen('DEFAULT')}>
            <FontAwesome6 name="arrow-left" size={20} color={COLORS.primary} />
            <Text style={styles.backText}>Dashboard</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>POS Settings</Text>
        </View>

        <View style={styles.mainCard}>
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

          <SettingsSection title="Other Settings">
            <PickerItem
              label="Captain / Salesman"
              value={selectedSalesmanId}
              onValueChange={setSelectedSalesmanId}
              items={salesmen}
              icon="user-tie"
            />
            <View style={[styles.inputContainer, isTablet && styles.tabletInput]}>
              <View style={styles.labelRow}>
                <FontAwesome6 name="table" size={14} color={COLORS.primary} />
                <Text style={styles.inputLabel}>Customer Table</Text>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker style={styles.picker} enabled={false} dropdownIconColor={COLORS.greyText}>
                  <Picker.Item label="Not Connected" value="" color={COLORS.greyText} />
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

export default POSSettingsScreen;
