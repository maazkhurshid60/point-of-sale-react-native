// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
// import { COLORS } from '../../constants/colors';
// import { BaseSlipData } from '../../store/useDialogStore';
// import { TRANSFORM_DATE_TIME_TO_STRING } from '../../utils/helpers';
// import { useCartStore } from '../../store/useCartStore';

// interface RawBillPrintDialogProps {
//   slipData: BaseSlipData;
//   onClose?: () => void;
// }

// export default function RawBillPrintDialog({ slipData, onClose }: RawBillPrintDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   const handleTicket = () => {
//     console.log('Ticket action for raw bill to be implemented');
//   };

//   const renderProductRow = ({ item, index }: { item: any, index: number }) => {
//     const product = slipData.products?.[index] || item.product || {};
//     return (
//       <View style={styles.tableRow}>
//         <Text style={[styles.tableCell, { flex: 1.5 }]}>{product.sku || ''}</Text>
//         <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={1}>{product.name || product.product_name || ''}</Text>
//         <Text style={[styles.tableCell, styles.cellBold]}>{item.qty || product.qty || 0}</Text>
//         <Text style={[styles.tableCell, styles.cellBold]}>{item.selling_price || product.selling_price || 0}</Text>
//         <Text style={[styles.tableCell, styles.cellBold]}>{item.discount || product.discount || 0}</Text>
//         <Text style={[styles.tableCell, styles.cellBold, { textAlign: 'right' }]}>{item.subtotal || product.subtotal || 0}</Text>
//       </View>
//     );
//   };

//   const calcSubTotal = () => {
//     const items = slipData.saleItems || slipData.products || [];
//     return items.reduce((acc: number, item: any) => acc + (parseFloat(item.subtotal || item.product?.subtotal) || 0), 0);
//   };

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '95%' : 910, maxHeight: isPortrait ? height * 0.9 : 700 }]}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
        
//         {/* Title */}
//         <Text style={styles.title}>Raw Bill Print</Text>

//         {/* Header Information */}
//         <View style={styles.headerBlock}>
//           <View style={styles.headerRow}>
//             <Text style={styles.companyName} numberOfLines={1}>{slipData.companyData?.company_name}</Text>
//             <Text style={[styles.companyName, { textAlign: 'right' }]} numberOfLines={1}>{slipData.usersData?.customer_name}</Text>
//           </View>

//           <View style={styles.headerRow}>
//             <Text style={styles.companyAddress} numberOfLines={1}>
//               {slipData.companyData?.lead_street || ''} {slipData.companyData?.lead_country || ''}
//             </Text>
//             <Text style={[styles.customerText, { textAlign: 'right' }]}>
//               Customer ID: {slipData.usersData?.customer_id || ''}
//             </Text>
//           </View>

//           <View style={styles.headerRow}>
//             <Text style={styles.companyContact}>{slipData.companyData?.lead_contact || 'N/A'}</Text>
//             {slipData.usersData?.salesman_id && (
//               <Text style={[styles.customerText, { textAlign: 'right' }]}>
//                 Salesman: {slipData.usersData?.salesman_name || ''}
//               </Text>
//             )}
//           </View>

//           {slipData.usersData?.salesman_id && (
//             <View style={[styles.headerRow, { justifyContent: 'flex-end' }]}>
//               <Text style={styles.customerText}>
//                 Salesman Id: {slipData.usersData?.salesman_id || ''}
//               </Text>
//             </View>
//           )}

//           <View style={[styles.headerRow, { justifyContent: 'flex-end' }]}>
//             <Text style={[styles.customerText, { fontWeight: '500' }]}>
//               Date: {slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at)) : ''}
//             </Text>
//           </View>
//         </View>

//         {/* Info Banner */}
//         <View style={styles.infoBanner}>
//           <Text style={styles.infoBannerText}>
//              <Text style={{ fontWeight: '400' }}>Sale Person: </Text>
//              {slipData.usersData?.sale_person || 'N/A'}
//           </Text>
//           <Text style={styles.infoBannerText}>
//              <Text style={{ fontWeight: '400' }}>Issued at: </Text>
//              {slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at), true) : ''}
//           </Text>
//         </View>

//         {/* Product Table */}
//         <View style={styles.tableContainer}>
//           <View style={styles.tableHeader}>
//             <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>SKU</Text>
//             <Text style={[styles.tableHeaderText, { flex: 3 }]}>Product</Text>
//             <Text style={styles.tableHeaderText}>Quantity</Text>
//             <Text style={styles.tableHeaderText}>Price</Text>
//             <Text style={styles.tableHeaderText}>Discount</Text>
//             <Text style={[styles.tableHeaderText, { textAlign: 'right' }]}>Sub-Total</Text>
//           </View>
          
//           {(slipData.products || slipData.saleItems || []).map((item: any, index: number) => (
//             <React.Fragment key={index}>
//               {renderProductRow({ item, index })}
//             </React.Fragment>
//           ))}

//           {/* Footer Rows */}
//           <View style={styles.tableFooterRow}>
//             <Text style={[styles.tableCell, { flex: 6.5 }]}></Text>
//             <Text style={[styles.tableCell, styles.cellBold]}>Total</Text>
//             <Text style={[styles.tableCell, styles.cellBold, { textAlign: 'right' }]}>{calcSubTotal()}</Text>
//           </View>
//           <View style={styles.tableFooterRow}>
//             <Text style={[styles.tableCell, { flex: 6.5 }]}></Text>
//             <Text style={[styles.tableCell, styles.cellBold]}>GST (18%)</Text>
//             <Text style={[styles.tableCell, styles.cellBold, { textAlign: 'right' }]}>{slipData.saleData?.total_tax || 0}</Text>
//           </View>
//         </View>

//         {/* Note */}
//         <Text style={styles.noteText}>
//           Note: Raw Bill Print Only. No sale has made against this bill
//         </Text>

//         {/* Actions & offered price */}
//         <View style={styles.actions}>
//           <View style={{ flexDirection: 'row' }}>
//             <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//               <Text style={styles.closeBtnText}>Close</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.ticketBtn} onPress={handleTicket}>
//               <Text style={styles.ticketBtnText}>Ticket</Text>
//             </TouchableOpacity>
//           </View>
          
//           <Text style={styles.totalsText}>
//             <Text style={{ fontWeight: '400', color: COLORS.textDark, fontSize: 20 }}>Grand Total </Text>
//             {slipData.saleData?.total_bill || 0}
//           </Text>
//         </View>

//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   dialogCard: {
//     backgroundColor: 'rgba(235, 235, 235, 1)',
//     borderRadius: 15,
//     padding: 30,
//     alignSelf: 'center',
//     elevation: 5,
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
//   headerBlock: {
//     marginBottom: 10,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   companyName: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//     flex: 1,
//   },
//   companyAddress: {
//     fontSize: 15,
//     fontWeight: '400',
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//     flex: 1,
//   },
//   companyContact: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//   },
//   customerText: {
//     fontSize: 15,
//     fontWeight: '400',
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//   },
//   infoBanner: {
//     backgroundColor: COLORS.primary,
//     borderRadius: 5,
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     paddingVertical: 10,
//     marginBottom: 15,
//     flexWrap: 'wrap',
//   },
//   infoBannerText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontWeight: '600',
//     fontFamily: 'Montserrat',
//     marginHorizontal: 5,
//   },
//   tableContainer: {
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 15,
//     padding: 15,
//     marginBottom: 10,
//     backgroundColor: COLORS.white,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.1)',
//     marginBottom: 10,
//   },
//   tableHeaderText: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.primary,
//     fontFamily: 'Montserrat',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.05)',
//   },
//   tableFooterRow: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//   },
//   tableCell: {
//     flex: 1,
//     fontSize: 14,
//     color: COLORS.greyText,
//     fontFamily: 'Montserrat',
//   },
//   cellBold: {
//     fontWeight: '600',
//   },
//   noteText: {
//     color: '#E53E3E',
//     fontSize: 16,
//     fontFamily: 'Montserrat',
//     fontWeight: '400',
//     marginBottom: 20,
//   },
//   totalsText: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: COLORS.primary,
//     fontFamily: 'Montserrat',
//     marginBottom: 5,
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   closeBtn: {
//     backgroundColor: '#dc3545',
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 6,
//     marginRight: 10,
//   },
//   closeBtnText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'Montserrat',
//   },
//   ticketBtn: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 6,
//   },
//   ticketBtnText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'Montserrat',
//   },
// });
