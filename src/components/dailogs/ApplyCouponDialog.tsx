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
// import { useCartStore } from '../../store/useCartStore';
// import { COLORS } from '../../constants/colors';
// import { Coupon } from '../../models';

// interface ApplyCouponDialogProps {
//   onApply?: (coupon: Coupon) => void;
//   onClose: () => void;
// }

// export default function ApplyCouponDialog({ onApply, onClose }: ApplyCouponDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   const validateCoupon = useAuthStore((state) => state.validateCoupon);
//   const setAppliedCoupon = useCartStore((state) => state.setAppliedCoupon);

//   const [couponCode, setCouponCode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleApply = async () => {
//     if (!couponCode.trim()) {
//       setError('Please enter a coupon code');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);
//       const coupon = await validateCoupon(couponCode);
//       setIsLoading(false);

//       if (coupon) {
//         const amount = parseFloat(coupon.coupon_amount) || 0;
//         setAppliedCoupon(amount);
//         if (onApply) onApply(coupon);
//         onClose();
//       } else {
//         setError('Invalid coupon code or expired');
//       }
//     } catch (e: any) {
//       setIsLoading(false);
//       setError(e.toString());
//     }
//   };

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 450 }]}>
//       <Text style={styles.title}>Apply Coupon</Text>

//       <Text style={styles.label}>Enter Coupon Number</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Coupon Code"
//         value={couponCode}
//         onChangeText={(text) => {
//           setCouponCode(text);
//           setError(null);
//         }}
//         autoFocus
//         autoCapitalize="characters"
//         onSubmitEditing={handleApply}
//       />

//       {error && <Text style={styles.errorText}>{error}</Text>}

//       <View style={styles.buttonRow}>
//         <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
//           <Text style={styles.cancelText}>Cancel</Text>
//         </TouchableOpacity>

//         {!isLoading ? (
//           <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
//             <Text style={styles.applyText}>Apply</Text>
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
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//     marginBottom: 8,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: 'rgba(196, 196, 196, 1)',
//     borderRadius: 8,
//     fontSize: 18,
//     textAlign: 'center',
//     fontFamily: 'Montserrat',
//     color: COLORS.textDark,
//     marginBottom: 10,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     fontFamily: 'Montserrat',
//     marginBottom: 10,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 15,
//     marginTop: 10,
//   },
//   cancelBtn: {
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 6,
//   },
//   applyBtn: {
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     backgroundColor: COLORS.primary,
//     borderRadius: 6,
//   },
//   cancelText: {
//     color: COLORS.greyText,
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'Montserrat',
//   },
//   applyText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'Montserrat',
//   },
// });
