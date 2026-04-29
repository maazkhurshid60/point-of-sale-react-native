import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { CustomButton } from '../../components/common/CustomButton';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { LinearGradient } from 'expo-linear-gradient';
import { useEditSaleController } from './hooks/useEditSaleController';
import { styles } from './EditSaleScreen.styles';

// Conditional import for DateTimePicker
let DateTimePicker: any;
try {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (e) {
  DateTimePicker = null;
}

const EditSaleScreen: React.FC = () => {
  const {
    isTablet,
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
  } = useEditSaleController();

  if (isLoading || !currentlySelectedSale) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loaderText}>Loading sale details...</Text>
      </View>
    );
  }

  const renderTableHeader = () => (
    <View style={styles.tableHeaderRow}>
      <View style={{ width: 40 }} />
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>SKU</Text>
      <Text style={[styles.columnHeader, { width: 250, textAlign: 'center' }]} numberOfLines={1}>Product</Text>
      <Text style={[styles.columnHeader, { width: 80, textAlign: 'center' }]} numberOfLines={1}>Price</Text>
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>Qty</Text>
      <Text style={[styles.columnHeader, { width: 80, textAlign: 'center' }]} numberOfLines={1}>Discount</Text>
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>Total</Text>
      <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>Status</Text>
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
      <Text style={[styles.cellText, { width: 100, textAlign: 'center' }]} numberOfLines={1}>{item.sku}</Text>
      <Text style={[styles.cellText, { width: 250, textAlign: 'center' }]} numberOfLines={1}>{item.product_name}</Text>

      {isReturn ? (
        <View style={{ width: 80, alignItems: 'center' }}>
          <TextInput
            style={[styles.cellInput, { width: '100%', textAlign: 'center' }]}
            value={String(item.price || '')}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={COLORS.greyText}
            onChangeText={(val) => updateReturnProduct(index, 'price', Number(val) || 0)}
          />
        </View>
      ) : (
        <Text style={[styles.cellText, { width: 80, textAlign: 'center' }]} numberOfLines={1}>{item.price}</Text>
      )}

      {isReturn ? (
        <View style={[styles.qtyControl, { width: 100, justifyContent: 'center' }]}>
          <TouchableOpacity onPress={() => updateReturnProduct(index, 'qty', (item.qty || 0) - 1)}>
            <FontAwesome6 name="minus" size={12} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={[styles.qtyText, { textAlign: 'center' }]} numberOfLines={1}>{item.qty}</Text>
          <TouchableOpacity onPress={() => updateReturnProduct(index, 'qty', (item.qty || 0) + 1)}>
            <FontAwesome6 name="plus" size={12} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.cellText, { width: 100, textAlign: 'center' }]} numberOfLines={1}>{item.qty}</Text>
      )}

      <Text style={[styles.cellText, { width: 80, textAlign: 'center' }]} numberOfLines={1}>
        {Number(item.discount_amount || 0).toFixed(2)}
      </Text>

      <Text style={[styles.cellText, { width: 100, textAlign: 'center' }]} numberOfLines={1}>
        {isReturn ? (Math.abs(item.qty) * Math.abs(item.price)).toFixed(2) : Number(item.total).toFixed(2)}
      </Text>

      <View style={{ width: 100, alignItems: 'center' }}>
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
      <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.header}>
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
      </LinearGradient>

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
          <CustomButton
            title="Edit Advance Mode"
            onPress={() => Alert.alert('Notice', 'Advance mode redirect logic happens here.')}
            variant="danger"
            size="large"
            style={{ flex: 1 }}
          />

          <CustomButton
            title="Update Sale"
            onPress={handleUpdate}
            variant="primary"
            size="large"
            style={{ flex: 1 }}
          />
        </View>

        {/* Transactions Table Section */}
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <View style={styles.methodButtonContainer}>
            <CustomDropdown
              options={[
                { label: "Cash", value: "Cash" },
                { label: "Bank", value: "Bank" },
                { label: "Card", value: "Card" },
                { label: "Coupon", value: "Coupon" },
              ]}
              selectedValue=""
              onValueChange={(val) => {
                if (val) addPaymentMethod(0.0, val);
              }}
              placeholder="Add Method"
              style={styles.methodPickerBtn}
              textStyle={{ fontSize: 14 }}
              iconColor={COLORS.primary}
            />
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
                <Text style={[styles.columnHeader, { width: 80, textAlign: 'center' }]} numberOfLines={1}>Type</Text>
                <Text style={[styles.columnHeader, { width: 100, textAlign: 'center' }]} numberOfLines={1}>Method</Text>
                <Text style={[styles.columnHeader, { width: 180, textAlign: 'center' }]} numberOfLines={1}>Account</Text>
                <Text style={[styles.columnHeader, { width: 120, textAlign: 'center' }]} numberOfLines={1}>Date</Text>
                <Text style={[styles.columnHeader, { width: 140, textAlign: 'center' }]} numberOfLines={1}>Ref / Code</Text>
                <Text style={[styles.columnHeader, { width: 120, textAlign: 'center' }]} numberOfLines={1}>Amount</Text>
                <View style={{ width: 40 }} />
              </View>


              {currentlySelectedSale.transactions.map((tr: any, idx: number) => (
                <View key={`tr-${idx}`} style={styles.tableRow}>
                  <Text style={[styles.cellText, { width: 80, textAlign: 'center' }]} numberOfLines={1}>{tr.type}</Text>
                  <Text style={[styles.cellText, { width: 100, textAlign: 'center' }]} numberOfLines={1}>{tr.payment_method}</Text>
                  <Text style={[styles.cellText, { width: 180, textAlign: 'center' }]} numberOfLines={1}>{tr.account_id || 'Cash'}</Text>
                  <Text style={[styles.cellText, { width: 120, textAlign: 'center' }]} numberOfLines={1}>{new Date(tr.created_at).toLocaleDateString()}</Text>
                  <Text style={[styles.cellText, { width: 140, textAlign: 'center' }]} numberOfLines={1}>{tr.ref || ''}</Text>
                  <Text style={[styles.cellText, { width: 120, textAlign: 'center' }]} numberOfLines={1}>
                    {Number(tr.amount).toFixed(2)}
                    <FontAwesome6 name="lock" size={12} color={COLORS.textDark} style={{ marginLeft: 5 }} />
                  </Text>
                  <View style={{ width: 40 }} />
                </View>
              ))}

              {paymentsList.map((p: any, idx: number) => (
                <View key={`pay-${idx}`} style={[styles.tableRow, { backgroundColor: 'white' }]}>
                  <Text style={[styles.cellText, { width: 80, textAlign: 'center' }]} numberOfLines={1}>{p.type}</Text>
                  <Text style={[styles.cellText, { width: 100, textAlign: 'center' }]} numberOfLines={1}>{p.method}</Text>

                  <View style={{ width: 180, alignItems: 'center' }}>
                    {p.method === 'Coupon' ? (
                      <Text style={[styles.cellText, { color: COLORS.greyText }]} numberOfLines={1}>N/A</Text>
                    ) : (
                      <CustomDropdown
                        options={
                          p.method === 'Cash'
                            ? accountStore.cashAccounts.map((acc: any) => ({ label: acc.name, value: String(acc.id) }))
                            : accountStore.bankAccounts.map((acc: any) => ({ label: acc.name, value: String(acc.id) }))
                        }
                        selectedValue={String(p.account_id || '')}
                        onValueChange={(val) => updatePayment(idx, 'account_id', val)}
                        placeholder="Select Account"
                        style={[styles.cellPickerBtn, { width: '100%' }]}
                        textStyle={{ fontSize: 13, textAlign: 'center' }}
                        iconColor={COLORS.primary}
                      />
                    )}
                  </View>
                  <View style={{ width: 120, alignItems: 'center' }}>
                    {p.method === 'Coupon' ? (
                       <Text style={[styles.cellText, { color: COLORS.greyText }]} numberOfLines={1}>—</Text>
                    ) : (
                      <TouchableOpacity
                        style={[styles.cellInput, { width: '100%', justifyContent: 'center', alignItems: 'center' }]}
                        onPress={() => {
                          setEditingPaymentIndex(idx);
                          setShowDatePicker(true);
                        }}
                      >
                        <Text style={{ color: COLORS.textDark, fontSize: 13 }} numberOfLines={1}>
                          {p.date || new Date().toISOString().split('T')[0]}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ width: 140, alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                    <TextInput
                      style={[styles.cellInput, { flex: 1, color: COLORS.textDark, textAlign: 'center' }]}
                      placeholder={p.method === 'Coupon' ? 'Code...' : 'Ref'}
                      placeholderTextColor={COLORS.greyText}
                      value={p.ref || ''}
                      onChangeText={(val) => updatePayment(idx, 'ref', val)}
                    />
                    {p.method === 'Coupon' && (
                       <TouchableOpacity
                         style={[
                           styles.validateBtn, 
                           couponStatus[idx]?.valid ? { backgroundColor: COLORS.posGreen } : {}
                         ]}
                         onPress={() => handleValidateCoupon(idx, p.ref || '')}
                       >
                         {couponStatus[idx]?.loading ? (
                            <ActivityIndicator size="small" color="white" />
                         ) : couponStatus[idx]?.valid ? (
                            <FontAwesome6 name="check" size={12} color="white" />
                         ) : (
                            <FontAwesome6 name="magnifying-glass" size={12} color="white" />
                         )}
                       </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ width: 120, alignItems: 'center' }}>
                    <TextInput
                      style={[styles.cellInput, { width: '100%', textAlign: 'center', color: COLORS.textDark }]}
                      value={String(p.amount || '')}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor={COLORS.greyText}
                      editable={!(p.method === 'Coupon' && couponStatus[idx]?.valid)}
                      onChangeText={(val) => updatePayment(idx, 'amount', Number(val) || 0)}
                    />
                  </View>
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

export default EditSaleScreen;
