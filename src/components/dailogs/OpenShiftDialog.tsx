// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   FlatList,
//   useWindowDimensions,
//   Keyboard,
// } from 'react-native';
// import { useAuthStore } from '../../store/useAuthStore';
// import { useStores, usePOSIDs } from '../../api/queries';
// import { COLORS } from '../../constants/colors';

// interface OpenShiftDialogProps {
//   onOpen?: (amount: number) => void;
//   onClose: () => void;
// }

// export default function OpenShiftDialog({ onOpen, onClose }: OpenShiftDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   const openShift = useAuthStore((state) => state.openShift);
//   const { data: stores, isLoading: loadingStores } = useStores();
//   const { data: posIds, isLoading: loadingPos } = usePOSIDs();

//   const [amount, setAmount] = useState('');
//   const [selectedStore, setSelectedStore] = useState<number | null>(null);
//   const [selectedPos, setSelectedPos] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (stores && stores.length > 0) {
//       setSelectedStore(stores[0].store_id);
//     }
//   }, [stores]);

//   useEffect(() => {
//     if (posIds && posIds.length > 0) {
//       setSelectedPos(posIds[0].fbr_pos_id);
//     }
//   }, [posIds]);

//   const handleOkay = async () => {
//     if (!selectedStore || !selectedPos) {
//       alert('Please select a store and POS ID');
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const success = await openShift(selectedStore, parseFloat(amount) || 0, selectedPos);
//       setIsSubmitting(false);

//       if (success) {
//         if (onOpen) onOpen(parseFloat(amount) || 0);
//         onClose();
//       } else {
//         alert('Failed to open shift. Please check your connection.');
//       }
//     } catch (e: any) {
//       setIsSubmitting(false);
//       alert(e.toString());
//     }
//   };

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 500 }]}>
//       <Text style={styles.title}>Open Shift</Text>

//       <Text style={styles.label}>Enter Current Cash Amount</Text>
//       <TextInput
//         value={amount}
//         onChangeText={setAmount}
//         placeholder="Amount"
//         keyboardType="numeric"
//         style={styles.input}
//         textAlign="center"
//       />

//       <Text style={styles.label}>Select Store</Text>
//       <View style={styles.pickerContainer}>
//         {loadingStores ? (
//           <ActivityIndicator color={COLORS.primary} />
//         ) : (
//           <FlatList
//             data={stores}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(item) => item.store_id.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => setSelectedStore(item.store_id)}
//                 style={[
//                   styles.chip,
//                   selectedStore === item.store_id && styles.activeChip,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.chipText,
//                     selectedStore === item.store_id && styles.activeChipText,
//                   ]}
//                 >
//                   {item.name}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </View>

//       <Text style={styles.label}>Select POS ID</Text>
//       <View style={styles.pickerContainer}>
//         {loadingPos ? (
//           <ActivityIndicator color={COLORS.primary} />
//         ) : (
//           <FlatList
//             data={posIds}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(item) => item.fbr_pos_id}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => setSelectedPos(item.fbr_pos_id)}
//                 style={[
//                   styles.chip,
//                   selectedPos === item.fbr_pos_id && styles.activeChip,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.chipText,
//                     selectedPos === item.fbr_pos_id && styles.activeChipText,
//                   ]}
//                 >
//                   {item.name}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </View>

//       <View style={styles.buttonRow}>
//         {!isSubmitting ? (
//           <TouchableOpacity style={styles.okBtn} onPress={handleOkay}>
//             <Text style={styles.okText}>Okay</Text>
//           </TouchableOpacity>
//         ) : (
//           <ActivityIndicator color={COLORS.primary} />
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
//     fontSize: 28, // Matches 30.sp scaled down slightly
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
//     marginTop: 10,
//   },
//   input: {
//     width: 200,
//     height: 50,
//     borderWidth: 1,
//     borderColor: 'rgba(196, 196, 196, 1)',
//     borderRadius: 8,
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.textDark,
//     marginBottom: 10,
//   },
//   pickerContainer: {
//     width: '100%',
//     height: 50,
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   chip: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     marginRight: 10,
//     justifyContent: 'center',
//     height: 40,
//   },
//   activeChip: {
//     backgroundColor: COLORS.primary,
//   },
//   chipText: {
//     color: COLORS.primary,
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   activeChipText: {
//     color: COLORS.white,
//   },
//   buttonRow: {
//     marginTop: 20,
//     width: '100%',
//     alignItems: 'center',
//   },
//   okBtn: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 8,
//   },
//   okText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'Montserrat',
//   },
// });
