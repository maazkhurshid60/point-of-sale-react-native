// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   useWindowDimensions,
//   Keyboard,
// } from 'react-native';
// import { useAuthStore } from '../../store/useAuthStore';
// import { COLORS } from '../../constants/colors';

// interface CloseShiftDialogProps {
//   onConfirm?: (amount: number) => void;
//   onClose: () => void;
// }

// export default function CloseShiftDialog({ onConfirm, onClose }: CloseShiftDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   const closeShift = useAuthStore((state) => state.closeShift);
//   const [amount, setAmount] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleOkay = async () => {
//     try {
//       setIsSubmitting(true);
//       const success = await closeShift(parseFloat(amount) || 0);
//       setIsSubmitting(false);

//       if (success) {
//         if (onConfirm) onConfirm(parseFloat(amount) || 0);
//         onClose();
//       } else {
//         alert('Failed to close shift. Please check your connection.');
//       }
//     } catch (e: any) {
//       setIsSubmitting(false);
//       alert(e.toString());
//     }
//   };

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 500 }]}>
//       <Text style={styles.title}>Close Shift</Text>

//       <Text style={styles.label}>Closing Amount</Text>
//       <View style={styles.inputContainer}>
//         <TextInput
//           value={amount}
//           onChangeText={setAmount}
//           placeholder="Amount"
//           placeholderTextColor="rgba(142, 142, 142, 0.5)"
//           keyboardType="numeric"
//           style={styles.input}
//           autoFocus
//           maxLength={7}
//           textAlign="center"
//           onSubmitEditing={handleOkay}
//         />
//       </View>

//       <View style={styles.buttonRow}>
//         <TouchableOpacity 
//           style={styles.cancelBtn} 
//           onPress={onClose}
//         >
//           <Text style={styles.cancelText}>Cancel</Text>
//         </TouchableOpacity>

//         {!isSubmitting ? (
//           <TouchableOpacity 
//             style={styles.okBtn} 
//             onPress={handleOkay}
//           >
//             <Text style={styles.okText}>Okay</Text>
//           </TouchableOpacity>
//         ) : (
//           <ActivityIndicator color={COLORS.primary} style={{ marginLeft: 20 }} />
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   dialogCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: 15,
//     padding: 24,
//     alignItems: 'center',
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.primary,
//     fontFamily: 'Montserrat',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//     marginBottom: 10,
//   },
//   inputContainer: {
//     width: 200,
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: 'rgba(196, 196, 196, 1)',
//     borderRadius: 8,
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//     paddingVertical: 10,
//     height: 60,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 12,
//     marginTop: 10,
//   },
//   cancelBtn: {
//     paddingVertical: 8,
//     paddingHorizontal: 25,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 6,
//   },
//   okBtn: {
//     paddingVertical: 8,
//     paddingHorizontal: 30,
//     backgroundColor: COLORS.primary,
//     borderRadius: 6,
//   },
//   cancelText: {
//     color: COLORS.greyText,
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'Montserrat',
//   },
//   okText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'Montserrat',
//   },
// });
