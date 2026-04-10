import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const POSExpenseScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const accountHeads = useAuthStore((state) => state.accountHeads);
  const purchaseOrders = useAuthStore((state) => state.purchaseOrders);
  const cashAccounts = useAuthStore((state) => state.cashAccounts);
  const fetchAccountHeads = useAuthStore((state) => state.fetchAccountHeads);
  const fetchPurchaseOrders = useAuthStore((state) => state.fetchPurchaseOrders);
  const addPOSExpense = useAuthStore((state) => state.addPOSExpense);
  const setScreen = useUIStore((state) => state.setScreen);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    head_id: '',
    account_no: '',
    amount: '',
    payment_method: 'cash',
    payment_account: '',
    date: new Date().toISOString().split('T')[0],
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

  const handleSubmit = async () => {
    if (!formData.head_id || !formData.amount) {
      alert('Please fill in required fields (Head and Amount)');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
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

  const renderInput = (label: string, value: string, onChange: (t: string) => void, placeholder: string, keyboard: any = 'default', multi = false) => (
    <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multi && styles.textArea]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboard}
        multiline={multi}
        numberOfLines={multi ? 4 : 1}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setScreen('DEFAULT')}>
          <FontAwesome6 name="arrow-left" size={20} color={COLORS.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add POS Expense</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <View style={[styles.row, !isTablet && styles.column]}>
            {/* Account Head */}
            <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
              <Text style={styles.label}>Head *</Text>
              <View style={styles.pickerContainer}>
                <TextInput
                  style={styles.input}
                  value={selectedHead?.name || ''}
                  placeholder="Select Head Account"
                  editable={false}
                />
                <ScrollView style={styles.dropdown} nestedScrollEnabled>
                  {headsList.map(head => (
                    <TouchableOpacity 
                      key={head.id} 
                      style={styles.dropdownItem}
                      onPress={() => setFormData({...formData, head_id: head.id.toString()})}
                    >
                      <Text style={styles.dropdownText}>{head.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {renderInput('Account No', formData.account_no, (t) => setFormData({...formData, account_no: t}), 'Enter account number')}
          </View>

          <View style={[styles.row, !isTablet && styles.column]}>
            {renderInput('Amount *', formData.amount, (t) => setFormData({...formData, amount: t}), '0.00', 'numeric')}
            
            <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
              <Text style={styles.label}>Payment Method</Text>
              <View style={styles.methodToggle}>
                {['cash', 'bank', 'card'].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[styles.methodBtn, formData.payment_method === method && styles.activeMethod]}
                    onPress={() => setFormData({...formData, payment_method: method})}
                  >
                    <Text style={[styles.methodBtnText, formData.payment_method === method && styles.activeMethodText]}>
                      {method.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.row, !isTablet && styles.column]}>
            {renderInput('Date', formData.date, (t) => setFormData({...formData, date: t}), 'YYYY-MM-DD')}
            
            <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
              <Text style={styles.label}>Select Account</Text>
              <View style={styles.pickerContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Choose account"
                  editable={false}
                />
                <ScrollView style={styles.dropdown} nestedScrollEnabled>
                  {accountsList.map(acc => (
                    <TouchableOpacity 
                      key={acc.id} 
                      style={styles.dropdownItem}
                      onPress={() => setFormData({...formData, payment_account: acc.id.toString()})}
                    >
                      <Text style={styles.dropdownText}>{acc.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          {renderInput('Notes', formData.note, (t) => setFormData({...formData, note: t}), 'Enter details...', 'default', true)}

          {isAccountsPayable && (
            <View style={styles.payableSection}>
              <Text style={styles.sectionTitle}>Supplier Details</Text>
              <View style={[styles.row, !isTablet && styles.column]}>
                <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
                  <Text style={styles.label}>Select PO</Text>
                  <View style={styles.pickerContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Select Purchase Order"
                      editable={false}
                    />
                    <ScrollView style={styles.dropdown} nestedScrollEnabled>
                      {poList.map(po => (
                        <TouchableOpacity 
                          key={po.purchaseId} 
                          style={styles.dropdownItem}
                          onPress={() => setFormData({...formData, po: po.purchaseId.toString()})}
                        >
                          <Text style={styles.dropdownText}>{po.purchaseInvoice || `PO #${po.purchaseId}`}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
                  <Text style={styles.label}>Deposit Slip</Text>
                  <TouchableOpacity style={styles.filePicker} onPress={handlePickDocument}>
                    <FontAwesome6 name="paperclip" size={16} color={COLORS.primary} />
                    <Text style={styles.filePickerText}>
                      {attachment ? attachment.name : 'Select File'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setScreen('DEFAULT')}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>Save Record</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    flex: 1,
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: '#1E293B',
  },
  scrollContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
    gap: 15,
  },
  fieldContainer: {
    flex: 1,
  },
  tabletField: {
    maxWidth: '48%',
  },
  label: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    position: 'relative',
  },
  dropdown: {
    maxHeight: 150,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#334155',
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
  },
  methodBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeMethod: {
    backgroundColor: COLORS.primary,
  },
  methodBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 12,
    color: '#64748B',
  },
  activeMethodText: {
    color: 'white',
  },
  payableSection: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  sectionTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 15,
  },
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  filePickerText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: COLORS.primary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    marginTop: 30,
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelBtnText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    color: '#64748B',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  saveBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
  },
});
