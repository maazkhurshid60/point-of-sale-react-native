// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, FlatList } from 'react-native';
// import { COLORS } from '../../constants/colors';
// import { BaseSlipData } from '../../store/useDialogStore';
// import { TRANSFORM_DATE_TIME_TO_STRING } from '../../utils/helpers';
// import { useCartStore } from '../../store/useCartStore';

// interface InvoiceDialogProps {
//   slipData: BaseSlipData;
//   onClose?: () => void;
// }

// export default function InvoiceDialog({ slipData, onClose }: InvoiceDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   // Compute total tax similar to Flutter implementation
//   const activeTaxesList = useCartStore(state => state.activeTaxesList) || [];
//   let totalTax = 0.0;
//   for (const tax of activeTaxesList) {
//     totalTax += tax.tax;
//   }
//   const appliedTax = totalTax;

//   const handlePrint = () => {
//     // Printing to be implemented later or via a separate print service
//     console.log('Print invoice functionality to be implemented');
//   };

//   const renderProductRow = ({ item }: { item: any }) => (
//     <View style={styles.tableRow}>
//       <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.product?.sku || ''}</Text>
//       <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={1}>{item.product?.product_name || ''}</Text>
//       <Text style={[styles.tableCell, styles.cellBold]}>{item.qty || 0}</Text>
//       <Text style={[styles.tableCell, styles.cellBold]}>{item.price || 0}</Text>
//       <Text style={[styles.tableCell, styles.cellBold]}>{item.discount || 0}</Text>
//       <Text style={[styles.tableCell, styles.cellBold, { textAlign: 'right' }]}>{item.subtotal || 0}</Text>
//     </View>
//   );

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '95%' : 910, maxHeight: isPortrait ? height * 0.9 : 700 }]}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
        
//         {/* Title */}
//         <Text style={styles.title}>Sale Invoice</Text>

//         {/* Header Information */}
//         <View style={styles.headerBlock}>
//           <View style={styles.headerRow}>
//             <Text style={styles.companyName} numberOfLines={1}>{slipData.companyData?.company_name}</Text>
//             <Text style={styles.issuedAt}>
//               <Text style={{ fontWeight: '400' }}>Issued at: </Text>
//               {slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at), true) : ''}
//             </Text>
//           </View>

//           <View style={styles.headerRow}>
//             <Text style={styles.companyAddress} numberOfLines={1}>
//               {slipData.companyData?.lead_street || ''} {slipData.companyData?.lead_city || ''}
//             </Text>
//             <Text style={styles.billTo}>Bill to: </Text>
//           </View>

//           <View style={styles.headerRow}>
//             <Text style={styles.companyContact}>{slipData.companyData?.lead_contact || 'N/A'}</Text>
//             <Text style={styles.customerAddress} numberOfLines={1}>
//               Customer Address: {slipData.customerData?.company_street || ''} {slipData.customerData?.company_city || ''}
//             </Text>
//           </View>

//           <View style={[styles.headerRow, { justifyContent: 'flex-end' }]}>
//             <Text style={styles.customerAddress} numberOfLines={1}>
//               Customer Name: {slipData.customerData?.name || 'N/A'}
//             </Text>
//           </View>
          
//           <View style={[styles.headerRow, { justifyContent: 'flex-end' }]}>
//             <Text style={styles.customerText}>Customer ID: {slipData.customerData?.customer_id || 'N/A'}</Text>
//           </View>

//           <View style={[styles.headerRow, { justifyContent: 'flex-end' }]}>
//              <Text style={styles.customerAddress} numberOfLines={1}>
//               Salesman: {slipData.salesmanData?.name || 'N/A'}
//              </Text>
//           </View>

//           <View style={[styles.headerRow, { justifyContent: 'flex-end' }]}>
//             <Text style={styles.customerText}>Salesman ID: {slipData.salesmanData?.user_id || 'N/A'}</Text>
//           </View>
//         </View>

//         {/* Invoice Banner Info */}
//         <View style={styles.infoBanner}>
//           <Text style={styles.infoBannerText}>
//              <Text style={{ fontWeight: '400' }}>Invoice No: </Text>
//              {slipData.saleData?.invoice_no}
//           </Text>
//           <Text style={styles.infoBannerText}>
//              <Text style={{ fontWeight: '400' }}>Physical Invoice No: </Text>
//              {slipData.saleData?.physical_invoice_no || 'N/A'}
//           </Text>
//           <Text style={styles.infoBannerText}>
//              <Text style={{ fontWeight: '400' }}>Cashier: </Text>
//              {slipData.cashierData?.name || 'N/A'}
//           </Text>
//           <Text style={styles.infoBannerText}>
//              <Text style={{ fontWeight: '400' }}>Status: </Text>
//              {slipData.saleData?.status || ''}
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
//             <Text style={[styles.tableHeaderText, { textAlign: 'right' }]}>Total</Text>
//           </View>
          
//           {slipData.saleItemsData?.map((item, index) => (
//             <React.Fragment key={index}>
//               {renderProductRow({ item })}
//             </React.Fragment>
//           ))}

//           {/* Footer Rows */}
//           <View style={styles.tableFooterRow}>
//             <Text style={[styles.tableCell, { flex: 6.5 }]}></Text>
//             <Text style={[styles.tableCell, styles.cellBold]}>Discount</Text>
//             <Text style={[styles.tableCell, styles.cellBold, { textAlign: 'right' }]}>{slipData.saleData?.total_discount || 0}</Text>
//           </View>
//           <View style={styles.tableFooterRow}>
//             <Text style={[styles.tableCell, { flex: 6.5 }]}></Text>
//             <Text style={[styles.tableCell, styles.cellBold]}>Sub-Total</Text>
//             <Text style={[styles.tableCell, styles.cellBold, { textAlign: 'right' }]}>{slipData.saleData?.actual_bill || 0}</Text>
//           </View>
//           <View style={styles.tableFooterRow}>
//             <Text style={[styles.tableCell, { flex: 6.5 }]}></Text>
//             <Text style={[styles.tableCell, styles.cellBold]}>GST ({appliedTax}%)</Text>
//             <Text style={[styles.tableCell, styles.cellBold, { textAlign: 'right' }]}>{slipData.saleData?.total_tax || 0}</Text>
//           </View>
//         </View>

//         {/* Totals Section */}
//         <View style={styles.totalsContainer}>
//           <Text style={styles.totalsText}>
//             <Text style={{ fontWeight: '400', color: COLORS.textDark }}>Total: </Text>
//             {slipData.saleData?.total_bill || 0}
//           </Text>
//           <Text style={styles.totalsText}>
//             <Text style={{ fontWeight: '400', color: COLORS.textDark }}>Amount Paid: </Text>
//             {slipData.saleData?.amount_paid || 0}
//           </Text>
//           <Text style={styles.totalsText}>
//             <Text style={{ fontWeight: '400', color: COLORS.textDark }}>Balance: </Text>
//             {slipData.saleData?.balance || 0}
//           </Text>
//         </View>

//         {/* Notes */}
//         <View style={styles.notesContainer}>
//           <Text style={styles.notesLabel}>Notes</Text>
//           <Text style={styles.notesText} numberOfLines={1}>{slipData.saleData?.notes || ''}</Text>
//         </View>

//         {/* Actions */}
//         <View style={styles.actions}>
//           <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//             <Text style={styles.closeBtnText}>Close</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
//             <Text style={styles.printBtnText}>Print</Text>
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
//   issuedAt: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//   },
//   billTo: {
//     fontSize: 15,
//     fontWeight: '400',
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//   },
//   customerAddress: {
//     fontSize: 15,
//     fontWeight: '400',
//     color: COLORS.textDark,
//     fontFamily: 'Montserrat',
//     textAlign: 'right',
//     maxWidth: 350,
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
//     marginBottom: 15,
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
//   totalsContainer: {
//     alignItems: 'flex-end',
//     marginBottom: 15,
//   },
//   totalsText: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.primary,
//     fontFamily: 'Montserrat',
//     marginBottom: 5,
//   },
//   notesContainer: {
//     marginBottom: 20,
//   },
//   notesLabel: {
//     fontSize: 16,
//     color: 'rgba(0,0,0,0.5)',
//     fontFamily: 'Montserrat',
//     marginBottom: 5,
//   },
//   notesText: {
//     fontSize: 14,
//     color: COLORS.greyText,
//     fontFamily: 'Montserrat',
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
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
//   printBtn: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 6,
//   },
//   printBtnText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '500',
//     fontFamily: 'Montserrat',
//   },
// });
