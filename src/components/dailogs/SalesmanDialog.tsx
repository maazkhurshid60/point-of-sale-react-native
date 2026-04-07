// import React, { useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   useWindowDimensions,
// } from 'react-native';
// import { useSalesman } from '../../api/queries';
// import { useAuthStore } from '../../store/useAuthStore';
// import { COLORS } from '../../constants/colors';
// import { Salesman } from '../../models';

// interface SalesmanDialogProps {
//   onSelect?: (salesman: Salesman) => void;
//   onClose: () => void;
// }

// export default function SalesmanDialog({ onSelect, onClose }: SalesmanDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   const { data: salesmen, isLoading } = useSalesman();
//   const updateSalesmanStore = useAuthStore((state) => state.updateSalesman);

//   const [searchQuery, setSearchQuery] = useState('');

//   const filteredSalesmen = useMemo(() => {
//     if (!salesmen) return [];
//     return salesmen.filter((s) =>
//       s.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [salesmen, searchQuery]);

//   const handleSelect = async (salesman: Salesman) => {
//     try {
//       const success = await updateSalesmanStore(salesman.name, salesman.user_id);
//       if (success) {
//         if (onSelect) onSelect(salesman);
//         onClose();
//       } else {
//         alert('Failed to update salesman. Please try again.');
//       }
//     } catch (e: any) {
//       alert(e.toString());
//     }
//   };

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 500, maxHeight: height * 0.8 }]}>
//       <Text style={styles.title}>Select Salesman</Text>

//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search salesman..."
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         autoFocus
//       />

//       <View style={styles.listContainer}>
//         {isLoading ? (
//           <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
//         ) : (
//           <FlatList
//             data={filteredSalesmen}
//             keyExtractor={(item) => item.user_id.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.salesmanItem}
//                 onPress={() => handleSelect(item)}
//               >
//                 <Text style={styles.salesmanName}>{item.name}</Text>
//               </TouchableOpacity>
//             )}
//             ListEmptyComponent={
//               <Text style={styles.emptyText}>No salesmen found</Text>
//             }
//           />
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
//     marginBottom: 15,
//   },
//   searchInput: {
//     width: '100%',
//     height: 45,
//     borderWidth: 1,
//     borderColor: 'rgba(196, 196, 196, 0.5)',
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     fontSize: 14,
//     fontFamily: 'Montserrat',
//     marginBottom: 15,
//     color: COLORS.textDark,
//   },
//   listContainer: {
//     width: '100%',
//     flex: 1,
//     minHeight: 200,
//   },
//   salesmanItem: {
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(142, 142, 142, 0.1)',
//   },
//   salesmanName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLORS.primary,
//     fontFamily: 'Montserrat',
//   },
//   emptyText: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: COLORS.greyText,
//     fontFamily: 'Montserrat',
//   },
// });
