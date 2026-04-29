// import React, { useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   useWindowDimensions,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import * as DocumentPicker from 'expo-document-picker';
// import { Picker } from '@react-native-picker/picker';
// import { useAuthStore } from '../../store/useAuthStore';
// import { POS_PERMISSION_STRING } from '../../constants/permissions';
// import { COLORS } from '../../constants/colors';
// import {
//   useAccountHeads,
//   useCashAccounts,
//   useBankAccounts,
//   useCreditCardAccounts,
//   usePOList,
// } from '../../api/queries';
// import { useAddPosExpenseMutation } from '../../api/shift/mutations';

// interface PosExpenseDialogProps {
//   onClose: () => void;
// }

// export default function PosExpenseDialog({ onClose }: PosExpenseDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   const authStore = useAuthStore.getState();
//   const dateFieldPermission = authStore.checkIfPermissionIsGranted(
//     POS_PERMISSION_STRING.PERMISSION_EXPENSE_DATEFIELD
//   );

//   const [selectedHeadId, setSelectedHeadId] = useState<number | ''>('');
//   const [accountNo, setAccountNo] = useState('');
//   const [amount, setAmount] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState<string>('cash');
//   const [paymentAccount, setPaymentAccount] = useState<number | ''>('');
//   const [selectedPO, setSelectedPO] = useState<number | ''>('');
//   const [notes, setNotes] = useState('');
//   const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
//   const [depositSlip, setDepositSlip] = useState<DocumentPicker.DocumentPickerResult | null>(null);

//   const { data: accountHeads = [], isLoading: loadingHeads } = useAccountHeads();
//   const { data: cashAccounts = [] } = useCashAccounts();
//   const { data: bankAccounts = [] } = useBankAccounts();
//   const { data: creditCardAccounts = [] } = useCreditCardAccounts();
//   const { data: poList = [] } = usePOList();

//   const { mutateAsync: addPosExpense, isPending } = useAddPosExpenseMutation();

//   const isHeadAccountsPayable = useMemo(() => {
//     if (!selectedHeadId) return false;
//     const head = accountHeads.find(h => h.id === selectedHeadId);
//     return head?.type === 'Accounts Payable';
//   }, [selectedHeadId, accountHeads]);

//   const paymentAccountsList = useMemo(() => {
//     switch (paymentMethod) {
//       case 'cash':
//         return cashAccounts;
//       case 'credit card':
//         return creditCardAccounts;
//       case 'bank transfer':
//       case 'cheque':
//         return bankAccounts;
//       default:
//         return cashAccounts;
//     }
//   }, [paymentMethod, cashAccounts, bankAccounts, creditCardAccounts]);

//   const handlePickDocument = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: '*/*',
//         copyToCacheDirectory: true,
//       });
//       if (result.canceled) return;
//       setDepositSlip(result);
//     } catch (err) {
//       Alert.alert('Error picking document', String(err));
//     }
//   };

//   const handleSave = async () => {
//     try {
//       if (!selectedHeadId) throw new Error('Please select an account head.');
//       const parsedAmount = parseFloat(amount || '0');
//       if (parsedAmount <= 0) throw new Error('Please enter a valid amount.');

//       const data: Record<string, any> = {
//         head_id: selectedHeadId,
//         account_id: parseInt(accountNo) || null,
//         amount: parsedAmount,
//         payment_method: paymentMethod,
//         payment_account: paymentAccount || null,
//         date: dateFieldPermission ? dateStr : new Date().toISOString().split('T')[0],
//         note: notes,
//       };

//       if (isHeadAccountsPayable) {
//         data['po'] = selectedPO || null;
//         if (depositSlip && !depositSlip.canceled && depositSlip.assets && depositSlip.assets.length > 0) {
//           const asset = depositSlip.assets[0];
//           data['deposit_slip_file'] = {
//             uri: asset.uri,
//             mimeType: asset.mimeType,
//           };
//           data['deposit_slip_filename'] = asset.name;
//         }
//       }

//       await addPosExpense(data);
//       onClose();
//     } catch (err: any) {
//       Alert.alert('Error', err.message || 'Failed to apply expense');
//     }
//   };

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 800, maxHeight: height * 0.9 }]}>
//       <Text style={styles.title}>POS Expense</Text>

//       <ScrollView contentContainerStyle={styles.scrollContent} style={{ width: '100%' }}>
        
//         {/* ROW 1: Head & Account No */}
//         <View style={[styles.row, isPortrait && styles.col]}>
//           <View style={styles.fieldContainer}>
//             <Text style={styles.label}>Head</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={selectedHeadId}
//                 onValueChange={(val: number | '') => setSelectedHeadId(val)}
//                 enabled={!loadingHeads && !isPending}
//               >
//                 <Picker.Item label="Select Head" value="" />
//                 {accountHeads.map(head => (
//                   <Picker.Item key={head.id} label={head.name} value={head.id} />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           <View style={styles.fieldContainer}>
//             <Text style={styles.label}>Account No</Text>
//             <TextInput
//               style={styles.input}
//               value={accountNo}
//               onChangeText={setAccountNo}
//               keyboardType="numeric"
//               editable={!isPending}
//             />
//           </View>
//         </View>

//         {/* ROW 2: Amount & Payment Method */}
//         <View style={[styles.row, isPortrait && styles.col]}>
//           <View style={styles.fieldContainer}>
//             <Text style={styles.label}>Amount</Text>
//             <TextInput
//               style={styles.input}
//               value={amount}
//               onChangeText={setAmount}
//               keyboardType="numeric"
//               editable={!isPending}
//             />
//           </View>

//           <View style={styles.fieldContainer}>
//             <Text style={styles.label}>Payment Method</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={paymentMethod}
//                 onValueChange={(val: string) => {
//                   setPaymentMethod(val);
//                   setPaymentAccount('');
//                 }}
//                 enabled={!isPending}
//               >
//                 <Picker.Item label="Cash" value="cash" />
//                 <Picker.Item label="Credit Card" value="credit card" />
//                 <Picker.Item label="Bank Transfer" value="bank transfer" />
//                 <Picker.Item label="Cheque" value="cheque" />
//               </Picker>
//             </View>
//           </View>
//         </View>

//         {/* ROW 3: Cash Account & Date */}
//         <View style={[styles.row, isPortrait && styles.col]}>
//           <View style={styles.fieldContainer}>
//             <Text style={styles.label}>Account / Register</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={paymentAccount}
//                 onValueChange={setPaymentAccount}
//                 enabled={!isPending}
//               >
//                 <Picker.Item label="Select Account" value="" />
//                 {paymentAccountsList.map((acc: any) => (
//                   <Picker.Item key={acc.id} label={acc.name || acc.account_name} value={acc.id} />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           {dateFieldPermission && (
//             <View style={styles.fieldContainer}>
//               <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
//               <TextInput
//                 style={styles.input}
//                 value={dateStr}
//                 onChangeText={setDateStr}
//                 editable={!isPending}
//               />
//             </View>
//           )}
//         </View>

//         {/* Notes */}
//         <View style={styles.fullFieldContainer}>
//           <Text style={styles.label}>Notes</Text>
//           <TextInput
//             style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
//             value={notes}
//             onChangeText={setNotes}
//             multiline
//             editable={!isPending}
//           />
//         </View>

//         {/* Accounts Payable Conditional Fields */}
//         {isHeadAccountsPayable && (
//           <View style={[styles.row, isPortrait && styles.col, { marginTop: 15 }]}>
//             <View style={styles.fieldContainer}>
//               <Text style={styles.label}>Select PO</Text>
//               <View style={styles.pickerContainer}>
//                 <Picker
//                   selectedValue={selectedPO}
//                   onValueChange={setSelectedPO}
//                   enabled={!isPending}
//                 >
//                   <Picker.Item label="Select PO" value="" />
//                   {poList.map((po: any) => (
//                     <Picker.Item key={po.id} label={po.reference_no} value={po.id} />
//                   ))}
//                 </Picker>
//               </View>
//             </View>

//             <View style={styles.fieldContainer}>
//               <Text style={styles.label}>Supplier Deposit Slip</Text>
//               <TouchableOpacity
//                 style={styles.filePickerBtn}
//                 onPress={handlePickDocument}
//                 disabled={isPending}
//               >
//                 <Text style={styles.filePickerText}>
//                   {depositSlip && !depositSlip.canceled && depositSlip.assets && depositSlip.assets.length > 0
//                     ? depositSlip.assets[0].name
//                     : 'Choose File'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//       </ScrollView>

//       <View style={styles.actions}>
//         <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isPending}>
//           <Text style={styles.cancelText}>Cancel</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.okayBtn} onPress={handleSave} disabled={isPending}>
//           {isPending ? (
//             <ActivityIndicator size="small" color={COLORS.white} />
//           ) : (
//             <Text style={styles.okayText}>Save Record</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   dialogCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: 15,
//     padding: 30,
//     alignSelf: 'center',
//     elevation: 5,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   scrollContent: {
//     paddingBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.primary,
//     fontFamily: 'Montserrat',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//     gap: 15,
//   },
//   col: {
//     flexDirection: 'column',
//   },
//   fieldContainer: {
//     flex: 1,
//     minWidth: '45%',
//   },
//   fullFieldContainer: {
//     width: '100%',
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 14,
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//     marginBottom: 5,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 4,
//     height: 45,
//     justifyContent: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: 'rgba(196, 196, 196, 1)',
//     borderRadius: 4,
//     paddingHorizontal: 10,
//     height: 45,
//     fontFamily: 'Montserrat',
//     color: COLORS.textDark,
//   },
//   filePickerBtn: {
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 4,
//     height: 45,
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//   },
//   filePickerText: {
//     color: COLORS.primary,
//     fontFamily: 'Montserrat',
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 10,
//   },
//   cancelBtn: {
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 6,
//     marginRight: 15,
//   },
//   cancelText: {
//     color: COLORS.greyText,
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'Montserrat',
//   },
//   okayBtn: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 6,
//     minWidth: 120,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   okayText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'Montserrat',
//   },
// });
