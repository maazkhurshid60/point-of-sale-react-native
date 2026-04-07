// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   useWindowDimensions,
//   Alert,
// } from 'react-native';
// import { useUpdateCashManagementMutation } from '../../api/shift/mutations';
// import { COLORS } from '../../constants/colors';

// interface CashManagementDialogProps {
//   onClose: (success?: boolean) => void;
// }

// export default function CashManagementDialog({ onClose }: CashManagementDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;
//   const isSmallWidth = width < 610 && isPortrait;

//   const [paidIn, setPaidIn] = useState('');
//   const [paidOut, setPaidOut] = useState('');
//   const [notes, setNotes] = useState('');

//   const { mutateAsync: updateCashManagement, isPending } = useUpdateCashManagementMutation();

//   const handleOkay = async () => {
//     try {
//       const pIn = parseFloat(paidIn || '0');
//       const pOut = parseFloat(paidOut || '0');

//       if (isNaN(pIn) || isNaN(pOut)) {
//         throw new Error('Please use numbers only');
//       }

//       await updateCashManagement({
//         paidIn: pIn,
//         paidOut: pOut,
//         notes: notes,
//       });

//       onClose(true);
//     } catch (e: any) {
//       Alert.alert('Error', e.message || 'Failed to update cash management');
//     }
//   };

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 500 }]}>
//       <Text style={styles.title}>Cash Management</Text>

//       <View style={styles.amountsRow}>
//         {/* Paid In */}
//         <View style={styles.amountContainer}>
//           <Text style={[styles.label, { fontSize: isSmallWidth ? 18 : 14 }]}>Paid In</Text>
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.amountInput}
//               value={paidIn}
//               onChangeText={setPaidIn}
//               keyboardType="numeric"
//               placeholder="Amount"
//               placeholderTextColor="rgba(142, 142, 142, 0.5)"
//               textAlign="center"
//               maxLength={7}
//               editable={!isPending}
//             />
//           </View>
//         </View>

//         <View style={{ width: 20 }} />

//         {/* Paid Out */}
//         <View style={styles.amountContainer}>
//           <Text style={[styles.label, { fontSize: isSmallWidth ? 18 : 14 }]}>Paid Out</Text>
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.amountInput}
//               value={paidOut}
//               onChangeText={setPaidOut}
//               keyboardType="numeric"
//               placeholder="Amount"
//               placeholderTextColor="rgba(142, 142, 142, 0.5)"
//               textAlign="center"
//               maxLength={7}
//               editable={!isPending}
//             />
//           </View>
//         </View>
//       </View>

//       <View style={{ height: isSmallWidth ? 10 : 20 }} />

//       {/* Remarks */}
//       <Text style={[styles.label, { fontSize: isSmallWidth ? 18 : 16, alignSelf: 'flex-start' }]}>Remarks</Text>
//       <TextInput
//         style={[styles.remarksInput, { fontSize: isSmallWidth ? 18 : 14 }]}
//         value={notes}
//         onChangeText={setNotes}
//         placeholder="Type your remark."
//         placeholderTextColor="rgba(textDarkColor, 0.5)"
//         multiline
//         numberOfLines={2}
//         maxLength={100}
//         editable={!isPending}
//       />

//       <View style={{ height: 20 }} />

//       <View style={styles.actions}>
//         <TouchableOpacity
//           style={styles.cancelBtn}
//           onPress={() => onClose()}
//           disabled={isPending}
//         >
//           <Text style={styles.cancelText}>Cancel</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.okayBtn}
//           onPress={handleOkay}
//           disabled={isPending}
//         >
//           {isPending ? (
//             <ActivityIndicator size="small" color={COLORS.white} />
//           ) : (
//             <Text style={styles.okayText}>Okay</Text>
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
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   title: {
//     fontSize: 24, // 30 on portrait, 24 on landscape in flutter, but sticking to 24 for simplicity
//     fontWeight: '700',
//     color: COLORS.primary,
//     fontFamily: 'Montserrat',
//     marginBottom: 20,
//   },
//   amountsRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     width: '100%',
//   },
//   amountContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   inputContainer: {
//     width: '100%',
//     height: 60,
//     borderWidth: 1,
//     borderColor: 'rgba(196, 196, 196, 1)',
//     borderRadius: 4,
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   label: {
//     color: COLORS.textDark,
//     fontWeight: '400',
//     fontFamily: 'Montserrat',
//   },
//   amountInput: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//     height: '100%',
//   },
//   remarksInput: {
//     width: '100%',
//     height: 50,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.primary,
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//     marginTop: 10,
//   },
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   cancelBtn: {
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 6,
//     marginRight: 10,
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
//     minWidth: 100,
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
