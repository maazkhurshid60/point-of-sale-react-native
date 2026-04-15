import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSalesStore } from '../../store/useSalesStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { Picker } from '@react-native-picker/picker';

// Conditional import for DateTimePicker to prevent crash if native module is missing
let DateTimePicker: any;
try {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (e) {
  console.warn('DateTimePicker native module not found, falling back to manual input');
  DateTimePicker = null;
}

const EditSaleScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const setScreen = useUIStore((state) => state.setScreen);
  const authStore = useAuthStore();

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
  const [showMethodMenu, setShowMethodMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState<number | null>(null);

  if (isLoading || !currentlySelectedSale) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loaderText}>Loading sale details...</Text>
      </View>
    );
  }

  const handleUpdate = async () => {
    const success = await makeReturnSale(currentlySelectedSale.sale_id);
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

  const renderTableHeader = () => (
    <View style={styles.tableHeaderRow}>
      <View style={{ width: 40 }} />
      <Text style={[styles.columnHeader, { flex: 1.5 }]}>SKU</Text>
      <Text style={[styles.columnHeader, { flex: 2.5 }]}>Product</Text>
      <Text style={[styles.columnHeader, { flex: 1 }]}>Price</Text>
      <Text style={[styles.columnHeader, { flex: 0.8 }]}>Qty</Text>
      <Text style={[styles.columnHeader, { flex: 1 }]}>Discount</Text>
      <Text style={[styles.columnHeader, { flex: 1 }]}>Total</Text>
      <Text style={[styles.columnHeader, { flex: 1.5 }]}>Status</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const isFulfilled = status === 'Fulfilled';
    return (
      <View style={[styles.statusBadge, { backgroundColor: isFulfilled ? COLORS.posGreen : COLORS.posRed }]}>
        <Text style={styles.statusBadgeText}>{status}</Text>
      </View>
    );
  };

  const renderItemRow = (item: any, index: number, isReturn = false) => (
    <View key={isReturn ? `return-${index}` : `item-${index}`} style={[styles.tableRow, isReturn && styles.returnRow]}>
      <View style={{ width: 40, alignItems: 'center' }}>
        {!isReturn && (
          <TouchableOpacity onPress={() => addReturnProduct(item)}>
            <FontAwesome6 name="share-from-square" size={18} color={COLORS.textDark} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.cellText, { flex: 1.5 }]}>{item.sku}</Text>
      <Text style={[styles.cellText, { flex: 2.5 }]} numberOfLines={1}>{item.product_name}</Text>

      {isReturn ? (
        <TextInput
          style={[styles.cellInput, { flex: 1 }]}
          value={String(item.price || '')}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor={COLORS.greyText}
          onChangeText={(val) => updateReturnProduct(index, 'price', Number(val) || 0)}
        />
      ) : (
        <Text style={[styles.cellText, { flex: 1 }]}>{item.price}</Text>
      )}

      {isReturn ? (
        <View style={[styles.qtyControl, { flex: 0.8 }]}>
          <TouchableOpacity onPress={() => updateReturnProduct(index, 'qty', (item.qty || 0) - 1)}>
            <FontAwesome6 name="minus" size={12} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.qty}</Text>
          <TouchableOpacity onPress={() => updateReturnProduct(index, 'qty', (item.qty || 0) + 1)}>
            <FontAwesome6 name="plus" size={12} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.cellText, { flex: 0.8 }]}>{item.qty}</Text>
      )}

      <Text style={[styles.cellText, { flex: 1 }]}>
        {Number(item.discount_amount || 0).toFixed(2)}
      </Text>

      <Text style={[styles.cellText, { flex: 1 }]}>
        {isReturn ? (Math.abs(item.qty) * Math.abs(item.price)).toFixed(2) : Number(item.total).toFixed(2)}
      </Text>

      <View style={{ flex: 1.5, alignItems: 'flex-start' }}>
        {isReturn ? null : <StatusBadge status={item.status || 'Unfulfilled'} />}
      </View>

      <View style={{ width: 40, alignItems: 'center' }}>
        {isReturn ? (
          <TouchableOpacity onPress={() => removeReturnProduct(index)}>
            <FontAwesome6 name="circle-xmark" size={18} color={COLORS.posRed} />
          </TouchableOpacity>
        ) : (
          <FontAwesome6 name="lock" size={16} color={COLORS.greyText} />
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <FontAwesome6 name="chevron-left" size={16} color={COLORS.textDark} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <Text style={styles.title}>Edit Sales</Text>
          <Text style={styles.customerName}>{currentlySelectedSale.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Sales Invoice: {currentlySelectedSale.invoice_no}</Text>
          <Text style={styles.infoText}>ID: {currentlySelectedSale.sale_id}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.tableBlock}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{ minWidth: '100%' }}
          >
            <View style={{ minWidth: isTablet ? '100%' : 900 }}>
              {renderTableHeader()}
              {currentlySelectedSale.sale_items.map((item: any, idx: number) => renderItemRow(item, idx))}
              {returnProductsList.map((item: any, idx: number) => renderItemRow(item, idx, true))}

              <View style={styles.searchRow}>
                <View style={{ width: 40 }} />
                <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    style={styles.skuInput}
                    placeholder="SKU/Barcode"
                    placeholderTextColor={COLORS.greyText}
                    value={skuSearch || ''}
                    onChangeText={setSkuSearch}
                    onSubmitEditing={() => {
                      if (skuSearch) {
                        searchProductBySku(skuSearch);
                        setSkuSearch('');
                      }
                    }}
                  />
                  <TouchableOpacity
                    style={styles.searchIconBtn}
                    onPress={() => {
                      if (skuSearch) {
                        searchProductBySku(skuSearch);
                        setSkuSearch('');
                      }
                    }}
                  >
                    <FontAwesome6 name="magnifying-glass" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Totals Section */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsHeader}>
            <Text style={styles.totalsHeaderText}>Tax: {totalTax.toFixed(2)}</Text>
            <Text style={styles.totalsHeaderText}>Discount: {totalDiscount.toFixed(2)}</Text>
            <Text style={styles.totalsHeaderText}>Total: Rs {totalBill.toFixed(2)}/-</Text>
          </View>

          <View style={styles.totalsBody}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Paid</Text>
              <Text style={styles.totalValue}>{totalPaid.toFixed(2)}/-</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: COLORS.posGreen }]}>New Adjustments</Text>
              <TextInput
                style={styles.adjustmentInput}
                value={String(newAdjustment || '')}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={COLORS.greyText}
                onChangeText={(val) => updateAdjustment(Number(val) || 0)}
              />
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Balance</Text>
              <Text style={styles.totalValue}>{totalBalance.toFixed(2)}/-</Text>
            </View>
          </View>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add your notes here..."
            placeholderTextColor={COLORS.greyText}
            multiline
            numberOfLines={2}
            value={notes || ''}
            onChangeText={setNotes}
          />
        </View>

        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.advanceBtn} onPress={() => Alert.alert('Notice', 'Advance mode redirect logic happens here.')}>
            <Text style={styles.advanceBtnText}>Edit Advance Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
            <Text style={styles.updateBtnText}>Update Sale</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions Table Section */}
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <View style={styles.methodButtonContainer}>
            <Picker
              selectedValue=""
              style={styles.methodPicker}
              dropdownIconColor="#000000"
              mode="dropdown"
              onValueChange={(itemValue) => {
                if (itemValue) addPaymentMethod(0.0, itemValue);
              }}
            >
              <Picker.Item label="Add Method" value="" color={COLORS.greyText} style={{ backgroundColor: COLORS.white }} />
              <Picker.Item label="Cash" value="Cash" color={COLORS.black} style={{ backgroundColor: COLORS.white }} />
              <Picker.Item label="Bank" value="Bank" color={COLORS.black} style={{ backgroundColor: COLORS.white }} />
              <Picker.Item label="Card" value="Card" color={COLORS.black} style={{ backgroundColor: COLORS.white }} />
            </Picker>
          </View>
        </View>

        <View style={[styles.tableBlock, { marginTop: 10 }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{ minWidth: '100%' }}
          >
            <View style={{ minWidth: isTablet ? '100%' : 900 }}>
              <View style={[styles.tableHeaderRow, { backgroundColor: COLORS.primary }]}>
                <Text style={[styles.columnHeader, { flex: 1 }]}>Type</Text>
                <Text style={[styles.columnHeader, { flex: 1 }]}>Method</Text>
                <Text style={[styles.columnHeader, { flex: 2 }]}>Account</Text>
                <Text style={[styles.columnHeader, { flex: 1.5 }]}>Date</Text>
                <Text style={[styles.columnHeader, { flex: 1 }]}>Ref</Text>
                <Text style={[styles.columnHeader, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
                <View style={{ width: 40 }} />
              </View>


              {/* Original Transactions */}
              {

                currentlySelectedSale.transactions.map((tr: any, idx: number) => (
                  <View key={`tr-${idx}`} style={styles.tableRow}>
                    <Text style={[styles.cellText, { flex: 1 }]}>{tr.type}</Text>
                    <Text style={[styles.cellText, { flex: 1 }]}>{tr.payment_method}</Text>
                    <Text style={[styles.cellText, { flex: 2 }]} numberOfLines={1}>{tr.account_id || 'Cash'}</Text>
                    <Text style={[styles.cellText, { flex: 1.5 }]}>{new Date(tr.created_at).toLocaleDateString()}</Text>
                    <Text style={[styles.cellText, { flex: 1 }]}>{tr.ref || ''}</Text>
                    <Text style={[styles.cellText, { flex: 1.5, textAlign: 'right' }]}>
                      {Number(tr.amount).toFixed(2)}
                      <FontAwesome6 name="lock" size={12} color={COLORS.textDark} style={{ marginLeft: 5 }} />
                    </Text>
                    <View style={{ width: 40 }} />
                  </View>
                ))}

              {/* New Payments */}
              {paymentsList.map((p: any, idx: number) => (
                <View key={`pay-${idx}`} style={[styles.tableRow, { backgroundColor: 'white' }]}>
                  <Text style={[styles.cellText, { flex: 1 }]}>{p.type}</Text>
                  <Text style={[styles.cellText, { flex: 1 }]}>{p.method}</Text>

                  <View style={{ flex: 2 }}>
                    <Picker
                      selectedValue={p.account_id}
                      style={styles.cellPicker}
                      dropdownIconColor={COLORS.primary}
                      mode="dropdown"
                      onValueChange={(val) => updatePayment(idx, 'account_id', val)}
                    >
                      {p.method === 'Cash' ? (
                        authStore.cashAccounts.map((acc: any) => (
                          <Picker.Item key={acc.id} label={acc.name} value={acc.id} color={COLORS.black} style={{ backgroundColor: COLORS.white }} />
                        ))
                      ) : (
                        authStore.bankAccounts.map((acc: any) => (
                          <Picker.Item key={acc.id} label={acc.name} value={acc.id} color={COLORS.black} style={{ backgroundColor: COLORS.white }} />
                        ))
                      )}
                    </Picker>
                  </View>
                  <TouchableOpacity
                    style={[styles.cellInput, { flex: 1.5, justifyContent: 'center' }]}
                    onPress={() => {
                      setEditingPaymentIndex(idx);
                      setShowDatePicker(true);
                    }}
                  >
                    <Text style={{ color: COLORS.textDark, fontSize: 13 }}>
                      {p.date || new Date().toISOString().split('T')[0]}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.cellInput, { flex: 1, color: COLORS.textDark }]}
                    placeholder="Ref"
                    placeholderTextColor={COLORS.greyText}
                    value={p.ref || ''}
                    onChangeText={(val) => updatePayment(idx, 'ref', val)}
                  />
                  <TextInput
                    style={[styles.cellInput, { flex: 1.5, textAlign: 'right', color: COLORS.textDark }]}
                    value={String(p.amount || '')}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={COLORS.greyText}
                    onChangeText={(val) => updatePayment(idx, 'amount', Number(val) || 0)}
                  />
                  <TouchableOpacity style={{ width: 40, alignItems: 'center' }} onPress={() => removePayment(idx)}>
                    <FontAwesome6 name="circle-xmark" size={18} color={COLORS.posRed} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {showDatePicker && (
          DateTimePicker ? (
            <DateTimePicker
              value={editingPaymentIndex !== null && paymentsList[editingPaymentIndex]?.date ? new Date(paymentsList[editingPaymentIndex].date) : new Date()}
              mode="date"
              display="default"
              onChange={(event: any, selectedDate: Date) => {
                setShowDatePicker(false);
                if (selectedDate && editingPaymentIndex !== null) {
                  const dateString = selectedDate.toISOString().split('T')[0];
                  updatePayment(editingPaymentIndex, 'date', dateString);
                }
                setEditingPaymentIndex(null);
              }}
            />
          ) : (
            (() => {
              setShowDatePicker(false);
              Alert.alert(
                'Date Picker Error',
                'The native date picker is not installed correctly or is missing. Please enter the date manually if possible.'
              );
              return null;
            })()
          )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    ...TYPOGRAPHY.montserrat.medium,
    marginTop: 10,
    color: COLORS.greyText,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 16,
    marginLeft: 10,
    color: '#646464',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
    color: COLORS.textDark,
  },
  customerName: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 20,
    color: COLORS.textDark,
  },
  infoRow: {
    alignItems: 'flex-end',
  },
  infoText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: COLORS.textDark,
  },
  content: {
    padding: 20,
    width: '100%',
  },
  tableBlock: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  columnHeader: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 12,
    color: 'white',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
    backgroundColor: 'rgba(106, 27, 154, 0.05)',
    width: '100%',
    gap: 10,
  },
  returnRow: {
    backgroundColor: 'white',
  },
  cellText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 13,
    color: '#4B5C69',
  },
  cellInput: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 13,
    color: COLORS.textDark,
  },
  cellPicker: {
    height: 48,
    width: '100%',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 5,
    backgroundColor: 'white',
  },
  qtyText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 13,
    color: COLORS.greyText,
    marginHorizontal: 8,
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusBadgeText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 10,
    color: 'white',
  },
  searchRow: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  skuInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    height: 36,
    paddingHorizontal: 10,
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: COLORS.textDark,
  },
  searchIconBtn: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  totalsContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  totalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    padding: 12,
  },
  totalsHeaderText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: 'white',
  },
  totalsBody: {
    padding: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: COLORS.greyText,
  },
  totalValue: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: COLORS.greyText,
  },
  adjustmentInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    textAlign: 'right',
    width: 100,
    fontSize: 14,
    color: COLORS.textDark,
  },
  notesSection: {
    marginTop: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: COLORS.textDark,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  advanceBtn: {
    backgroundColor: COLORS.posRed,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  advanceBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 14,
  },
  updateBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  updateBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 14,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  methodButtonContainer: {
    width: 160,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    height: 48,
    justifyContent: 'center',
  },
  methodPicker: {
    height: 48,
    width: '100%',
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
});

export default EditSaleScreen;
