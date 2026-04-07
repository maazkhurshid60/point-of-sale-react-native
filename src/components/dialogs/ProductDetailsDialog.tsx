// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from 'react-native';
// import { ScreenUtil } from '../../utils/ScreenUtil';
// import { COLORS } from '../../constants/colors';
// import { useProductStore } from '../../store/useProductStore';
// import { useAuthStore } from '../../store/useAuthStore';
// import { useDialogStore } from '../../store/useDialogStore';
// import { FontAwesome5 } from '@expo/vector-icons';

// export default function ProductDetailsDialog() {
//     const { activeDialog, dialogProps, hideDialog } = useDialogStore();
//     const { fetchSingleProductDetails } = useProductStore();
//     const { softwareSettings } = useAuthStore();
//     const visible = activeDialog === 'PRODUCT_DETAILS';
//     const productId = dialogProps?.productId;

//     const [loading, setLoading] = useState(true);
//     const [productData, setProductData] = useState<any>(null);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (visible && productId) {
//             loadDetails();
//         } else {
//             setProductData(null);
//             setError(null);
//             setLoading(true);
//         }
//     }, [visible, productId]);

//     const loadDetails = async () => {
//         setLoading(true);
//         try {
//             const data = await fetchSingleProductDetails(productId);
//             setProductData(data);
//         } catch (err: any) {
//             setError(err.message || 'Failed to load details');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!visible) return null;

//     const renderHeader = () => (
//         <View style={styles.header}>
//             <Text style={styles.title}>Product Details</Text>
//             <TouchableOpacity onPress={hideDialog} style={styles.closeIcon}>
//                 <FontAwesome5 name="times" size={ScreenUtil.width(20)} color="#666666" />
//             </TouchableOpacity>
//         </View>
//     );

//     const renderContent = () => {
//         if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>;
//         if (error) return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
//         if (!productData) return null;

//         const { record, store, warehouse, store_total, warehouse_total, productasset } = productData;
//         const allTotal = (store_total || 0) + (warehouse_total || 0);

//         return (
//             <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//                 <View style={styles.mainInfo}>
//                     <View style={styles.imageContainer}>
//                         {record.image ? (
//                             <Image source={{ uri: record.image }} style={styles.productImage} resizeMode="contain" />
//                         ) : (
//                             <View style={styles.placeholderImage}>
//                                 <FontAwesome5 name="box-open" size={ScreenUtil.width(80)} color="#CCCCCC" />
//                                 <Text style={styles.placeholderText}>No Image Available</Text>
//                             </View>
//                         )}
//                     </View>

//                     <View style={styles.detailsContainer}>
//                         <Text style={styles.productName} numberOfLines={2}>{record.product_name}</Text>
//                         <View style={styles.skuBarcodeRow}>
//                             <Text style={styles.skuText}>SKU: {record.sku}</Text>
//                             <Text style={styles.barcodeText}>Barcode: {record.barcode}</Text>
//                         </View>

//                         <View style={styles.priceRow}>
//                             <View style={styles.priceItem}>
//                                 <Text style={styles.priceLabel}>Selling Price</Text>
//                                 <Text style={styles.priceValue}>{softwareSettings?.currency_symbol || '$'} {record.selling_price}</Text>
//                             </View>
//                             <View style={styles.priceItem}>
//                                 <Text style={styles.priceLabel}>Wholesale</Text>
//                                 <Text style={styles.priceValue}>{softwareSettings?.currency_symbol || '$'} {record.whole_sale_price}</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>

//                 <View style={styles.stockSection}>
//                     <StockGroup title="Store Inventory" items={store} total={store_total} unit={record.unit} />
//                     <View style={styles.sectionDivider} />
//                     <StockGroup title="Warehouse Inventory" items={warehouse} total={warehouse_total} unit={record.unit} />
//                 </View>

//                 <View style={styles.footerTotal}>
//                     <Text style={styles.totalLabel}>Grand Total Stock</Text>
//                     <Text style={styles.totalValue}>{allTotal} {record.unit}</Text>
//                 </View>
//             </ScrollView>
//         );
//     };

//     return (
//         <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={hideDialog}>
//             <View style={styles.overlay}>
//                 <View style={styles.container}>
//                     {renderHeader()}
//                     {renderContent()}
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// const StockGroup = ({ title, items, total, unit }: any) => (
//     <View style={styles.stockGroup}>
//         <Text style={styles.stockGroupTitle}>{title}</Text>
//         {items && items.length > 0 ? (
//             items.map((item: any, idx: number) => (
//                 <View key={idx} style={styles.stockItem}>
//                     <Text style={styles.locationName}>{item.store_name || item.warehouse_name}</Text>
//                     <Text style={styles.qtyText}>{item.qty} {unit}</Text>
//                 </View>
//             ))
//         ) : (
//             <Text style={styles.noStockText}>No stock available in any location</Text>
//         )}
//         <View style={styles.subtotalRow}>
//             <Text style={styles.subtotalLabel}>Total</Text>
//             <Text style={styles.subtotalValue}>{total || 0} {unit}</Text>
//         </View>
//     </View>
// );

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.6)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     container: {
//         width: ScreenUtil.width(900),
//         height: ScreenUtil.height(650),
//         backgroundColor: '#F8F9FA',
//         borderRadius: ScreenUtil.width(20),
//         overflow: 'hidden',
//         elevation: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 5,
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: ScreenUtil.width(20),
//         backgroundColor: '#FFFFFF',
//         borderBottomWidth: 1,
//         borderBottomColor: '#EEEEEE',
//     },
//     title: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(22),
//         color: COLORS.primary,
//     },
//     closeIcon: {
//         position: 'absolute',
//         right: ScreenUtil.width(20),
//     },
//     scrollContent: {
//         padding: ScreenUtil.width(25),
//     },
//     center: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: ScreenUtil.width(50),
//     },
//     mainInfo: {
//         flexDirection: 'row',
//         marginBottom: ScreenUtil.height(30),
//     },
//     imageContainer: {
//         width: ScreenUtil.width(300),
//         height: ScreenUtil.width(300),
//         backgroundColor: '#FFFFFF',
//         borderRadius: ScreenUtil.width(15),
//         padding: ScreenUtil.width(10),
//         borderWidth: 1,
//         borderColor: '#EEEEEE',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     productImage: {
//         width: '100%',
//         height: '100%',
//     },
//     placeholderImage: {
//         alignItems: 'center',
//     },
//     placeholderText: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(12),
//         color: '#999999',
//         marginTop: ScreenUtil.height(10),
//     },
//     detailsContainer: {
//         flex: 1,
//         marginLeft: ScreenUtil.width(30),
//         justifyContent: 'center',
//     },
//     productName: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(26),
//         color: '#333333',
//         marginBottom: ScreenUtil.height(10),
//     },
//     skuBarcodeRow: {
//         marginBottom: ScreenUtil.height(20),
//     },
//     skuText: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#666666',
//         marginBottom: ScreenUtil.height(4),
//     },
//     barcodeText: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#666666',
//     },
//     priceRow: {
//         flexDirection: 'row',
//         marginTop: ScreenUtil.height(10),
//     },
//     priceItem: {
//         marginRight: ScreenUtil.width(40),
//     },
//     priceLabel: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(12),
//         color: '#888888',
//         marginBottom: ScreenUtil.height(5),
//     },
//     priceValue: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(20),
//         color: COLORS.primary,
//     },
//     stockSection: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: ScreenUtil.width(15),
//         padding: ScreenUtil.width(20),
//         borderWidth: 1,
//         borderColor: '#EEEEEE',
//     },
//     stockGroup: {
//         marginBottom: ScreenUtil.height(10),
//     },
//     stockGroupTitle: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(18),
//         color: '#333333',
//         marginBottom: ScreenUtil.height(15),
//         borderLeftWidth: 4,
//         borderLeftColor: COLORS.primary,
//         paddingLeft: ScreenUtil.width(10),
//     },
//     stockItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: ScreenUtil.height(8),
//         borderBottomWidth: 1,
//         borderBottomColor: '#F5F5F5',
//     },
//     locationName: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(15),
//         color: '#555555',
//     },
//     qtyText: {
//         fontFamily: 'Montserrat-SemiBold',
//         fontSize: ScreenUtil.setSpText(15),
//         color: '#333333',
//     },
//     noStockText: {
//         fontFamily: 'Montserrat-Italic',
//         fontSize: ScreenUtil.setSpText(13),
//         color: '#999999',
//         textAlign: 'center',
//         marginVertical: ScreenUtil.height(10),
//     },
//     subtotalRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: ScreenUtil.height(10),
//         paddingVertical: ScreenUtil.height(5),
//     },
//     subtotalLabel: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(16),
//         color: '#666666',
//     },
//     subtotalValue: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(16),
//         color: COLORS.primary,
//     },
//     sectionDivider: {
//         height: 1,
//         backgroundColor: '#EEEEEE',
//         marginVertical: ScreenUtil.height(20),
//     },
//     footerTotal: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginTop: ScreenUtil.height(30),
//         padding: ScreenUtil.width(20),
//         backgroundColor: COLORS.primary,
//         borderRadius: ScreenUtil.width(15),
//     },
//     totalLabel: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(18),
//         color: '#FFFFFF',
//     },
//     totalValue: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(24),
//         color: '#FFFFFF',
//     },
//     errorText: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(16),
//         color: '#FF0000',
//         textAlign: 'center',
//     },
// });
