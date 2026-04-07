// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
// import { COLORS } from '../../constants/colors';
// import { BaseSlipData } from '../../store/useDialogStore';
// import { TRANSFORM_DATE_TIME_TO_STRING } from '../../utils/helpers';

// interface SampleSaleSlipDialogProps {
//   slipData: BaseSlipData;
//   onClose?: () => void;
// }

// export default function SampleSaleSlipDialog({ slipData, onClose }: SampleSaleSlipDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   const renderProductRow = ({ item, index }: { item: any, index: number }) => {
//     const product = slipData.products?.[index] || item.product || {};
//     return (
//       <View style={styles.tableRow}>
//         <Text style={[styles.tableCell, { flex: 1.5 }]}>{product.sku || ''}</Text>
//         <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={1}>{product.name || product.product_name || ''}</Text>
//         <Text style={[styles.tableCell, styles.cellBold]}>{item.qty || 0}</Text>
//       </View>
//     );
//   };

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '95%' : 910, maxHeight: isPortrait ? height * 0.9 : 700 }]}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
        
//         {/* Title */}
//         <Text style={styles.title}>Sample Sale</Text>

//         {/* Header Information */}
//         <View style={styles.headerBlock}>
//           <View style={styles.headerRow}>
//             <Text style={styles.companyName} numberOfLines={1}>{slipData.companyData?.company_name}</Text>
//             <Text style={[styles.companyName, { textAlign: 'right' }]} numberOfLines={1}>{slipData.usersData?.customer_name}</Text>
//           </View>

//           <View style={styles.headerRow}>
//             <Text style={styles.companyAddress} numberOfLines={1}>
//               {slipData.companyData?.lead_street || ''} {slipData.companyData?.lead_city || ''}
//             </Text>
//             <Text style={[styles.customerText, { textAlign: 'right' }]}>
//               Customer ID: {slipData.usersData?.customer_id || ''}
//             </Text>
//           </View>

//           <View style={styles.headerRow}>
//             <Text style={styles.companyContact}>{slipData.companyData?.lead_contact || 'N/A'}</Text>
//             <Text style={[styles.customerText, { textAlign: 'right' }]}>
//               Date: {slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at)) : ''}
//             </Text>
//           </View>
//         </View>

//         {/* Info Banner */}
//         <View style={styles.infoBanner}>
//           <Text style={styles.infoBannerText}>
//              <Text style={{ fontWeight: '400' }}>Sample Invoice: </Text>
//              {slipData.saleData?.invoice_no}
//           </Text>
//           <Text style={styles.infoBannerText}>
//              <Text style={{ fontWeight: '400' }}>Sale Person: </Text>
//              {slipData.usersData?.sale_person || 'N/A'}
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
//             <Text style={styles.tableHeaderText}>Quantity</Text>
//           </View>
          
//           {slipData.saleItems?.map((item: any, index: number) => (
//             <React.Fragment key={index}>
//               {renderProductRow({ item, index })}
//             </React.Fragment>
//           ))}
//         </View>

//         {/* Actions */}
//         <View style={styles.actions}>
//           <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//             <Text style={styles.closeBtnText}>Cancel</Text>
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
//   tableCell: {
//     flex: 1,
//     fontSize: 14,
//     color: COLORS.greyText,
//     fontFamily: 'Montserrat',
//   },
//   cellBold: {
//     fontWeight: '600',
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   closeBtn: {
//     backgroundColor: COLORS.primary,
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
