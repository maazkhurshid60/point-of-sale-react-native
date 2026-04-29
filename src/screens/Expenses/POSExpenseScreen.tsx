import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/colors';
import { CustomButton } from '../../components/common/CustomButton';
import { usePOSExpenseController } from './hooks/usePOSExpenseController';
import { styles } from './POSExpenseScreen.styles';

export const POSExpenseScreen: React.FC = () => {
  const {
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
    setFormData,
    setShowDatePicker,
    handlePickDocument,
    onDateChange,
    handleSubmit,
    setScreen,
  } = usePOSExpenseController();

  const renderInput = (label: string, value: string, onChange: (t: string) => void, placeholder: string, keyboard: any = 'default', multi = false) => (
    <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multi && styles.textArea]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboard}
        multiline={multi}
        numberOfLines={multi ? 4 : 1}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomButton
          onPress={() => setScreen('DEFAULT')}
          variant="none"
          size="none"
          style={styles.backButton}
          iconComponent={<Ionicons name="arrow-back" size={24} color={COLORS.primary} />}
          title="Back"
          textStyle={styles.backText}
        />
        <Text style={styles.headerTitle}>Add POS Expense</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <View style={[styles.row, !isTablet && styles.column]}>
            <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
              <Text style={styles.label}>Head *</Text>
              <View style={styles.pickerContainer}>
                <TextInput
                  style={styles.input}
                  value={selectedHead?.name || ''}
                  placeholder="Select Head Account"
                  placeholderTextColor="#94A3B8"
                  editable={false}
                />
                <ScrollView style={styles.dropdown} nestedScrollEnabled>
                  {headsList.map(head => (
                    <TouchableOpacity
                      key={head.id}
                      style={styles.dropdownItem}
                      onPress={() => setFormData({ ...formData, head_id: head.id.toString() })}
                    >
                      <Text style={styles.dropdownText}>{head.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {renderInput('Account No', formData.account_no, (t) => setFormData({ ...formData, account_no: t }), 'Enter account number')}
          </View>

          <View style={[styles.row, !isTablet && styles.column]}>
            {renderInput('Amount *', formData.amount, (t) => setFormData({ ...formData, amount: t }), '0.00', 'numeric')}

            <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
              <Text style={styles.label}>Payment Method</Text>
              <View style={styles.methodToggle}>
                {['cash', 'bank', 'card'].map((method) => (
                  <CustomButton
                    key={method}
                    title={method.toUpperCase()}
                    variant={formData.payment_method === method ? 'primary' : 'none'}
                    size="none"
                    style={[styles.methodBtn, formData.payment_method === method && styles.activeMethod]}
                    textStyle={[styles.methodBtnText, formData.payment_method === method && styles.activeMethodText]}
                    onPress={() => setFormData({ ...formData, payment_method: method })}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.row, !isTablet && styles.column]}>
            <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: 'black', fontSize: 15 }}>
                  {formData.date.toISOString().split('T')[0]}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                />
              )}
            </View>

            <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
              <Text style={styles.label}>Select Account</Text>
              <View style={styles.pickerContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Choose account"
                  placeholderTextColor="#94A3B8"
                  value={accountsList.find(a => a.id.toString() === formData.payment_account)?.name || ''}
                  editable={false}
                />
                <ScrollView style={styles.dropdown} nestedScrollEnabled>
                  {accountsList.map(acc => (
                    <TouchableOpacity
                      key={acc.id}
                      style={styles.dropdownItem}
                      onPress={() => setFormData({ ...formData, payment_account: acc.id.toString() })}
                    >
                      <Text style={styles.dropdownText}>{acc.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          {renderInput('Notes', formData.note, (t) => setFormData({ ...formData, note: t }), 'Enter details...', 'default', true)}

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
                      placeholderTextColor="#94A3B8"
                      value={poList.find(p => p.purchaseId.toString() === formData.po)?.purchaseInvoice || ''}
                      editable={false}
                    />
                    <ScrollView style={styles.dropdown} nestedScrollEnabled>
                      {poList.map(po => (
                        <TouchableOpacity
                          key={po.purchaseId}
                          style={styles.dropdownItem}
                          onPress={() => setFormData({ ...formData, po: po.purchaseId.toString() })}
                    >
                          <Text style={styles.dropdownText}>{po.purchaseInvoice || `PO #${po.purchaseId}`}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                <View style={[styles.fieldContainer, isTablet && styles.tabletField]}>
                  <Text style={styles.label}>Deposit Slip</Text>
                  <CustomButton
                    onPress={handlePickDocument}
                    variant="none"
                    size="none"
                    style={styles.filePicker}
                    iconComponent={<FontAwesome6 name="paperclip" size={16} color={COLORS.primary} />}
                    title={attachment ? attachment.name : 'Select File'}
                    textStyle={styles.filePickerText}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.actionRow}>
            <CustomButton
              title="Cancel"
              onPress={() => setScreen('DEFAULT')}
              variant="outline"
              style={styles.cancelBtn}
              textStyle={styles.cancelBtnText}
            />
            <CustomButton
              title="Save Record"
              onPress={handleSubmit}
              isLoading={loading}
              disabled={loading}
              style={styles.saveBtn}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default POSExpenseScreen;
