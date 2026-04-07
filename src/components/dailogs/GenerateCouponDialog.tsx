// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
// import { ScreenUtil } from '../../utils/ScreenUtil';
// import { COLORS } from '../../constants/colors';
// import { useAuthStore } from '../../store/useAuthStore';
// import { useDialogStore } from '../../store/useDialogStore';
// import { Coupon } from '../../models';

// export default function GenerateCouponDialog() {
//     const { activeDialog, hideDialog } = useDialogStore();
//     const { generateCoupon, validateCoupon, softwareSettings } = useAuthStore();
//     const visible = activeDialog === 'GENERATE_COUPON';

//     const [activeTab, setActiveTab] = useState<'NEW' | 'EXISTING'>('NEW');
//     const [amount, setAmount] = useState('');
//     const [couponNumber, setCouponNumber] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [result, setResult] = useState<Coupon | null>(null);
//     const [error, setError] = useState<string | null>(null);

//     const handleGenerate = async () => {
//         if (!amount || isNaN(parseFloat(amount))) {
//             setError('Please enter a valid amount');
//             return;
//         }

//         setIsLoading(true);
//         setError(null);
//         setResult(null);

//         try {
//             const coupon = await generateCoupon(parseFloat(amount));
//             if (coupon) {
//                 setResult(coupon);
//                 setAmount('');
//             } else {
//                 setError('Failed to generate coupon');
//             }
//         } catch (err: any) {
//             setError(err.message || 'Error occurred');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleValidate = async () => {
//         if (!couponNumber.trim()) {
//             setError('Please enter coupon number');
//             return;
//         }

//         setIsLoading(true);
//         setError(null);
//         setResult(null);

//         try {
//             const coupon = await validateCoupon(couponNumber.trim());
//             if (coupon) {
//                 setResult(coupon);
//                 setCouponNumber('');
//             } else {
//                 setError('Invalid or expired coupon');
//             }
//         } catch (err: any) {
//             setError(err.message || 'Error occurred');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const reset = () => {
//         setAmount('');
//         setCouponNumber('');
//         setResult(null);
//         setError(null);
//         setIsLoading(false);
//     };

//     const handleClose = () => {
//         reset();
//         hideDialog();
//     };

//     return (
//         <Modal
//             animationType="fade"
//             transparent={true}
//             visible={visible}
//             onRequestClose={handleClose}
//         >
//             <TouchableOpacity
//                 style={styles.overlay}
//                 activeOpacity={1}
//                 onPress={handleClose}
//             >
//                 <TouchableOpacity
//                     style={styles.container}
//                     activeOpacity={1}
//                 >
//                     <Text style={styles.title}>Generate Coupon</Text>

//                     <View style={styles.tabs}>
//                         <TouchableOpacity
//                             style={[styles.tab, activeTab === 'NEW' && styles.activeTab]}
//                             onPress={() => { setActiveTab('NEW'); reset(); }}
//                         >
//                             <Text style={[styles.tabText, activeTab === 'NEW' && styles.activeTabText]}>New Coupon</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={[styles.tab, activeTab === 'EXISTING' && styles.activeTab]}
//                             onPress={() => { setActiveTab('EXISTING'); reset(); }}
//                         >
//                             <Text style={[styles.tabText, activeTab === 'EXISTING' && styles.activeTabText]}>Existing Coupon</Text>
//                         </TouchableOpacity>
//                     </View>

//                     <View style={styles.content}>
//                         {activeTab === 'NEW' ? (
//                             <View style={styles.inputSection}>
//                                 <Text style={styles.label}>Enter Coupon Amount ({softwareSettings?.currency_symbol || '$'})</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     value={amount}
//                                     onChangeText={setAmount}
//                                     placeholder="0.00"
//                                     keyboardType="numeric"
//                                     placeholderTextColor="#999"
//                                 />
//                                 <TouchableOpacity style={styles.actionButton} onPress={handleGenerate} disabled={isLoading}>
//                                     {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.actionButtonText}>Generate</Text>}
//                                 </TouchableOpacity>
//                             </View>
//                         ) : (
//                             <View style={styles.inputSection}>
//                                 <Text style={styles.label}>Enter Coupon Number</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     value={couponNumber}
//                                     onChangeText={setCouponNumber}
//                                     placeholder="Enter Number..."
//                                     placeholderTextColor="#999"
//                                 />
//                                 <TouchableOpacity style={styles.actionButton} onPress={handleValidate} disabled={isLoading}>
//                                     {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.actionButtonText}>Get Coupon</Text>}
//                                 </TouchableOpacity>
//                             </View>
//                         )}

//                         {error && <Text style={styles.errorText}>{error}</Text>}

//                         {result && (
//                             <View style={styles.resultContainer}>
//                                 <View style={styles.couponCard}>
//                                     <View style={styles.couponHeader}>
//                                         <Text style={styles.couponTitle}>COUPON</Text>
//                                         <Text style={styles.couponNumber}>{result.coupon_number}</Text>
//                                     </View>
//                                     <View style={styles.couponBody}>
//                                         <Text style={styles.couponAmount}>
//                                             {softwareSettings?.currency_symbol || '$'} {result.coupon_amount_left || result.coupon_amount}
//                                         </Text>
//                                         <Text style={styles.couponLabel}>Available Balance</Text>
//                                     </View>
//                                     <View style={styles.couponFooter}>
//                                         <Text style={styles.couponExpiry}>Status: {result.status}</Text>
//                                     </View>
//                                 </View>
//                             </View>
//                         )}
//                     </View>

//                     <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
//                         <Text style={styles.closeButtonText}>Done</Text>
//                     </TouchableOpacity>
//                 </TouchableOpacity>
//             </TouchableOpacity>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     container: {
//         width: ScreenUtil.width(600),
//         backgroundColor: '#FFFFFF',
//         borderRadius: ScreenUtil.width(15),
//         padding: ScreenUtil.width(30),
//         elevation: 5,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//     },
//     title: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(24),
//         color: COLORS.primary,
//         marginBottom: ScreenUtil.height(20),
//         textAlign: 'center',
//     },
//     tabs: {
//         flexDirection: 'row',
//         backgroundColor: '#F5F5F5',
//         borderRadius: ScreenUtil.width(8),
//         marginBottom: ScreenUtil.height(20),
//         padding: ScreenUtil.width(4),
//     },
//     tab: {
//         flex: 1,
//         paddingVertical: ScreenUtil.height(10),
//         alignItems: 'center',
//         borderRadius: ScreenUtil.width(6),
//     },
//     activeTab: {
//         backgroundColor: COLORS.primary,
//     },
//     tabText: {
//         fontFamily: 'Montserrat-SemiBold',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#666666',
//     },
//     activeTabText: {
//         color: '#FFFFFF',
//     },
//     content: {
//         minHeight: ScreenUtil.height(200),
//     },
//     inputSection: {
//         marginBottom: ScreenUtil.height(20),
//     },
//     label: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#333333',
//         marginBottom: ScreenUtil.height(8),
//     },
//     input: {
//         height: ScreenUtil.height(50),
//         borderWidth: 1,
//         borderColor: '#DDDDDD',
//         borderRadius: ScreenUtil.width(8),
//         paddingHorizontal: ScreenUtil.width(15),
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(16),
//         color: '#333333',
//         marginBottom: ScreenUtil.height(15),
//     },
//     actionButton: {
//         backgroundColor: COLORS.primary,
//         borderRadius: ScreenUtil.width(8),
//         height: ScreenUtil.height(50),
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     actionButtonText: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(16),
//         color: '#FFFFFF',
//     },
//     errorText: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#FF0000',
//         textAlign: 'center',
//         marginBottom: ScreenUtil.height(15),
//     },
//     resultContainer: {
//         marginTop: ScreenUtil.height(10),
//         padding: ScreenUtil.width(10),
//         backgroundColor: '#FAFAFA',
//         borderRadius: ScreenUtil.width(10),
//         borderStyle: 'dashed',
//         borderWidth: 1,
//         borderColor: COLORS.primary,
//     },
//     couponCard: {
//         alignItems: 'center',
//     },
//     couponHeader: {
//         alignItems: 'center',
//         marginBottom: ScreenUtil.height(15),
//     },
//     couponTitle: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(12),
//         color: '#999999',
//         letterSpacing: 2,
//     },
//     couponNumber: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(20),
//         color: COLORS.primary,
//     },
//     couponBody: {
//         alignItems: 'center',
//         marginBottom: ScreenUtil.height(15),
//     },
//     couponAmount: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(32),
//         color: '#333333',
//     },
//     couponLabel: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(12),
//         color: '#666666',
//     },
//     couponFooter: {
//         borderTopWidth: 1,
//         borderTopColor: '#EEEEEE',
//         paddingTop: ScreenUtil.height(10),
//         width: '100%',
//         alignItems: 'center',
//     },
//     couponExpiry: {
//         fontFamily: 'Montserrat-SemiBold',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#28A745',
//     },
//     closeButton: {
//         borderWidth: 1,
//         borderColor: COLORS.primary,
//         borderRadius: ScreenUtil.width(8),
//         paddingVertical: ScreenUtil.height(12),
//         marginTop: ScreenUtil.height(20),
//         alignItems: 'center',
//     },
//     closeButtonText: {
//         fontFamily: 'Montserrat-SemiBold',
//         fontSize: ScreenUtil.setSpText(16),
//         color: COLORS.primary,
//     },
// });
