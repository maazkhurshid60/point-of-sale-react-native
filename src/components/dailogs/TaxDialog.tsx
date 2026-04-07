// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   useWindowDimensions,
//   Alert,
// } from 'react-native';
// import Checkbox from 'expo-checkbox';
// import { useTaxes } from '../../api/queries';
// import { useUpdateTaxes } from '../../api/sales/mutations';
// import { useCartStore } from '../../store/useCartStore';
// import { COLORS } from '../../constants/colors';
// import { TaxModel } from '../../models';

// interface TaxDialogProps {
//   onApply?: () => void;
//   onClose: () => void;
// }

// export default function TaxDialog({ onApply, onClose }: TaxDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   const { data, isLoading, isError } = useTaxes();
//   const { mutateAsync: updateTaxes, isPending } = useUpdateTaxes();

//   const activeTaxesList = useCartStore((state) => state.activeTaxesList);
//   const addTaxToActive = useCartStore((state) => state.addTaxToActive);
//   const removeTaxFromActive = useCartStore((state) => state.removeTaxFromActive);

//   const taxesList = data?.taxes as TaxModel[] || [];

//   const handleToggleTax = (tax: TaxModel) => {
//     const isPresent = activeTaxesList.some((t) => t.tax_id === tax.tax_id);
//     if (isPresent) {
//       removeTaxFromActive(tax);
//     } else {
//       addTaxToActive(tax);
//     }
//   };

//   const handleApply = async () => {
//     try {
//       const activeIds = activeTaxesList.map((t) => t.tax_id);
//       await updateTaxes(activeIds);
//       onApply?.();
//       onClose();
//     } catch (e: any) {
//       Alert.alert('Error', e.message || 'Failed to update taxes.');
//     }
//   };

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 500 }]}>
//       <Text style={styles.title}>Tax</Text>

//       {isLoading ? (
//         <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 30 }} />
//       ) : isError ? (
//         <Text style={styles.errorText}>Failed to load taxes.</Text>
//       ) : (
//         <View style={styles.listContainer}>
//           {taxesList.map((tax) => {
//             const isPresent = activeTaxesList.some((t) => t.tax_id === tax.tax_id);
//             return (
//               <TouchableOpacity
//                 key={tax.tax_id}
//                 style={styles.taxRow}
//                 onPress={() => handleToggleTax(tax)}
//                 activeOpacity={0.7}
//               >
//                 <Checkbox
//                   value={isPresent}
//                   onValueChange={() => handleToggleTax(tax)}
//                   color={isPresent ? COLORS.primary : undefined}
//                 />
//                 <Text style={styles.taxText}>
//                   {tax.name} {tax.tax}%
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//       )}

//       <View style={styles.actions}>
//         <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isPending}>
//           <Text style={styles.cancelText}>Cancel</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.okayBtn} onPress={handleApply} disabled={isPending || isLoading}>
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
//     padding: 20,
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.primary,
//     fontFamily: 'Montserrat',
//     marginBottom: 20,
//   },
//   listContainer: {
//     width: '100%',
//     maxHeight: 250,
//   },
//   taxRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   taxText: {
//     fontSize: 14,
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//     marginLeft: 8,
//   },
//   errorText: {
//     color: '#FF5252',
//     fontFamily: 'Montserrat',
//     marginVertical: 20,
//   },
//   actions: {
//     flexDirection: 'row',
//     marginTop: 30,
//     gap: 15,
//   },
//   cancelBtn: {
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 6,
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
//   },
//   okayText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'Montserrat',
//   },
// });
