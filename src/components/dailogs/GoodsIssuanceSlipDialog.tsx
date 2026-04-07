// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
// import { COLORS } from '../../constants/colors';
// import { BaseSlipData } from '../../store/useDialogStore';
// import { TRANSFORM_DATE_TIME_TO_STRING } from '../../utils/helpers';

// interface GoodsIssuanceSlipDialogProps {
//   slipData: BaseSlipData;
//   onClose?: () => void;
// }

// export default function GoodsIssuanceSlipDialog({ slipData, onClose }: GoodsIssuanceSlipDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   const renderProductRow = ({ item, index }: { item: any, index: number }) => {
//     return (
//       <View style={styles.tableRow}>
//         <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.product?.sku || ''}</Text>
//         <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={1}>{item.product?.product_name || ''}</Text>
//         <Text style={[styles.tableCell, styles.cellBold]}>{slipData.orderedQtyList?.[index] || 0}</Text>
//         <Text style={[styles.tableCell, styles.cellBold]}>{slipData.availableQtyList?.[index] || 0}</Text>
//         <Text style={[styles.tableCell, styles.cellBold]}>{slipData.leftQtyList?.[index] || 0}</Text>
//       </View>
//     );
//   };

//   const calcTotal = (list: any[]) => {
//     if (!list || list.length === 0) return 0;
//     return list.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
//   };

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '95%' : 910, maxHeight: isPortrait ? height * 0.9 : 700 }]}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
        
//         {/* Title */}
//         <Text style={styles.title}>Goods Issuance Slip</Text>

//         {/* Header Information */}
//         <View style={styles.headerBlock}>
//           <View style={styles.headerRow}>
//             <Text style={styles.companyName} numberOfLines={1}>{slipData.companyData?.company_name}</Text>
//             <Text style={[styles.companyName, { textAlign: 'right' }]} numberOfLines={1}>{slipData.customerData?.name}</Text>
//           </View>

//           <View style={styles.headerRow}>
//             <Text style={styles.companyAddress} numberOfLines={1}>
//               {slipData.companyData?.lead_street || ''} {slipData.companyData?.lead_city || ''}
//             </Text>
//             <Text style={[styles.customerText, { textAlign: 'right' }]}>
//               Customer ID: {slipData.customerData?.customer_id || ''}
//             </Text>
//           </View>

//           <View style={styles.headerRow}>
//             <Text style={styles.companyContact}>{slipData.companyData?.lead_contact || 'N/A'}</Text>
//           </View>

//           <View style={[styles.headerRow, { justifyContent: 'flex-end' }]}>
//             <Text style={styles.customerText}>
//               Status: {slipData.saleData?.status || ''}
//             </Text>
//           </View>

//           <View style={[styles.headerRow, { justifyContent: 'flex-end' }]}>
//             <Text style={[styles.customerText, { fontWeight: '500' }]}>
//               Date: {slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at), true) : ''}
//             </Text>
//           </View>
//         </View>

//         {/* Info Banner */}
//         <View style={styles.infoBanner}>
//           <Text style={styles.infoBannerText}>
//              <Text style={{ fontWeight: '400' }}>Invoice No: </Text>
//              {slipData.saleData?.invoice_no}
//           </Text>
//           <Text style={styles.infoBannerText}>
//              <Text style={{ fontWeight: '400' }}>Sale Person: </Text>
//              {slipData.cashierData?.name || 'N/A'}
//           </Text>
//           <Text style={styles.infoBannerText}>
//              <Text style={{ fontWeight: '400' }}>Issued at: </Text>
//              {slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at)) : ''}
//           </Text>
//         </View>

//         {/* Product Table */}
//         <View style={styles.tableContainer}>
//           <View style={styles.tableHeader}>
//             <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>SKU</Text>
//             <Text style={[styles.tableHeaderText, { flex: 3 }]}>Product</Text>
//             <Text style={styles.tableHeaderText}>Ordered Qty</Text>
//             <Text style={styles.tableHeaderText}>Available Qty</Text>
//             <Text style={styles.tableHeaderText}>Left Qty</Text>
//           </View>
          
//           {slipData.saleItemsData?.map((item: any, index: number) => (
//             <React.Fragment key={index}>
//               {renderProductRow({ item, index })}
//             </React.Fragment>
//           ))}

//           {/* Footer Totals */}
//           <View style={styles.tableFooterRow}>
//             <Text style={[styles.tableCell, { flex: 4.5 }]}></Text>
//             <Text style={[styles.tableCell, styles.cellTotal]}>Total</Text>
//             <Text style={[styles.tableCell, styles.cellTotalNumber]}>{calcTotal(slipData.orderedQtyList)}</Text>
//             <Text style={[styles.tableCell, styles.cellTotalNumber]}>{calcTotal(slipData.availableQtyList)}</Text>
//             <Text style={[styles.tableCell, styles.cellTotalNumber]}>{calcTotal(slipData.leftQtyList)}</Text>
//           </View>
//         </View>

//         {/* Actions */}
//         <View style={styles.actions}>
//           <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//             <Text style={styles.closeBtnText}>Close</Text>
//           </TouchableOpacity>
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
//     paddingHorizontal: 20,
//     marginBottom: 15,
//   },
//   infoBannerText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontWeight: '600',
//     fontFamily: 'Montserrat',
//   },
//   tableContainer: {
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 15,
//     padding: 15,
//     marginBottom: 30,
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
//     fontSize: 14,
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
//     marginTop: 10,
//   },
//   tableCell: {
//     flex: 1,
//     fontSize: 13,
//     color: COLORS.greyText,
//     fontFamily: 'Montserrat',
//   },
//   cellBold: {
//     fontWeight: '600',
//   },
//   cellTotal: {
//     fontWeight: '400',
//     color: COLORS.greyText,
//   },
//   cellTotalNumber: {
//     fontWeight: '600',
//     color: '#E53E3E', // posRedColor equivalent
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   closeBtn: {
//     backgroundColor: '#dc3545',
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 6,
//   },
//   closeBtnText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'Montserrat',
//   },
// });
