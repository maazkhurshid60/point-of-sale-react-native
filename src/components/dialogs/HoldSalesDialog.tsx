// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   useWindowDimensions,
//   Alert,
// } from 'react-native';
// import { useInfiniteHoldSales } from '../../api/sales/queries';
// import { useHoldSalesActions } from '../../hooks/useHoldSalesActions';
// import { COLORS } from '../../constants/colors';
// import { SaleHistoryItem } from '../../models';

// interface HoldSalesDialogProps {
//   onHold?: (tag: string) => void;
//   onClose: () => void;
// }

// export default function HoldSalesDialog({ onHold, onClose }: HoldSalesDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//   } = useInfiniteHoldSales();

//   const { loadHoldSale, deleteHoldSale } = useHoldSalesActions();

//   const holdSales = data?.pages.flatMap(page => page.sales) || [];

//   const handleOpen = async (sale: SaleHistoryItem) => {
//     const success = await loadHoldSale(sale);
//     if (success) {
//       onClose();
//     } else {
//       Alert.alert('Error', 'Failed to load hold sale.');
//     }
//   };

//   const handleDelete = (saleId: number) => {
//     Alert.alert(
//       'Delete Hold Sale',
//       'Are you sure you want to delete this hold sale?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Delete', 
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await deleteHoldSale(saleId);
//             } catch (e) {
//               Alert.alert('Error', 'Failed to delete hold sale.');
//             }
//           }
//         },
//       ]
//     );
//   };

//   const renderHeader = () => (
//     <View style={styles.headerRow}>
//       <Text style={[styles.headerCell, { flex: 1 }]}>ID</Text>
//       <Text style={[styles.headerCell, { flex: 2 }]}>Date</Text>
//       <Text style={[styles.headerCell, { flex: 2, textAlign: 'right' }]}>Total</Text>
//       <Text style={[styles.headerCell, { flex: 2, textAlign: 'center' }]}>Actions</Text>
//     </View>
//   );

//   const renderItem = ({ item }: { item: SaleHistoryItem }) => (
//     <View style={styles.itemRow}>
//       <Text style={[styles.itemText, { flex: 1 }]}>{item.sale_id}</Text>
//       <Text style={[styles.itemText, { flex: 2 }]}>
//         {new Date(item.created_at).toLocaleDateString()}
//       </Text>
//       <Text style={[styles.itemText, { flex: 2, textAlign: 'right', fontWeight: 'bold' }]}>
//         Rs {item.total_bill.toFixed(0)}
//       </Text>
//       <View style={[styles.actions, { flex: 2 }]}>
//         <TouchableOpacity 
//           style={styles.openBtn} 
//           onPress={() => handleOpen(item)}
//         >
//           <Text style={styles.btnText}>Open</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.deleteBtn} 
//           onPress={() => handleDelete(item.sale_id)}
//         >
//           <Text style={styles.btnText}>Del</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '98%' : 700, maxHeight: height * 0.8 }]}>
//       <Text style={styles.title}>Sales on Hold</Text>

//       {isLoading ? (
//         <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 50 }} />
//       ) : (
//         <View style={styles.listWrapper}>
//           {renderHeader()}
//           <FlatList
//             data={holdSales}
//             keyExtractor={(item) => item.sale_id.toString()}
//             renderItem={renderItem}
//             onEndReached={() => hasNextPage && fetchNextPage()}
//             onEndReachedThreshold={0.5}
//             ListFooterComponent={
//               isFetchingNextPage ? <ActivityIndicator color={COLORS.primary} /> : null
//             }
//             ListEmptyComponent={
//               <Text style={styles.emptyText}>No hold sales available</Text>
//             }
//           />
//         </View>
//       )}

//       <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//         <Text style={styles.closeText}>Close</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   dialogCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: 15,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: COLORS.primary,
//     fontFamily: 'Montserrat',
//     marginBottom: 20,
//   },
//   listWrapper: {
//     width: '100%',
//     flex: 1,
//     minHeight: 300,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     paddingVertical: 10,
//     borderBottomWidth: 2,
//     borderBottomColor: COLORS.primary,
//     backgroundColor: 'rgba(98, 0, 238, 0.05)',
//   },
//   headerCell: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: COLORS.primary,
//     fontFamily: 'Montserrat',
//     paddingHorizontal: 5,
//   },
//   itemRow: {
//     flexDirection: 'row',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(142, 142, 142, 0.1)',
//     alignItems: 'center',
//   },
//   itemText: {
//     fontSize: 13,
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//     paddingHorizontal: 5,
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   openBtn: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 4,
//   },
//   deleteBtn: {
//     backgroundColor: '#FF5252',
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 4,
//   },
//   btnText: {
//     color: COLORS.white,
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   emptyText: {
//     textAlign: 'center',
//     marginTop: 40,
//     color: COLORS.greyText,
//     fontFamily: 'Montserrat',
//   },
//   closeBtn: {
//     marginTop: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 40,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 6,
//   },
//   closeText: {
//     color: COLORS.primary,
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'Montserrat',
//   },
// });
