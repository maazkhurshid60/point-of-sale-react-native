// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Switch } from 'react-native';
// import { ScreenUtil } from '../../utils/ScreenUtil';
// import { COLORS } from '../../constants/colors';
// import { useAuthStore } from '../../store/useAuthStore';
// import { useDialogStore } from '../../store/useDialogStore';
// import { BankAccount, CashAccount, CreditCardAccount, Store } from '../../models';
// import { FontAwesome5 } from '@expo/vector-icons';

// export default function PosSettingsDialog() {
//     const { activeDialog, hideDialog } = useDialogStore();
//     const {
//         currentShift,
//         softwareSettings,
//         fetchBankAccounts,
//         fetchCashAccounts,
//         fetchCreditCardAccounts,
//         updateDefaultAccounts,
//         checkIfPermissionIsGranted
//     } = useAuthStore();

//     const visible = activeDialog === 'POS_SETTINGS';

//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);

//     // Data lists
//     const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
//     const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
//     const [cardAccounts, setCreditCardAccounts] = useState<CreditCardAccount[]>([]);

//     // Selected values
//     const [selectedBank, setSelectedBank] = useState<number | null>(null);
//     const [selectedCash, setSelectedCash] = useState<number | null>(null);
//     const [selectedCard, setSelectedCard] = useState<number | null>(null);
//     const [fbrStatus, setFbrStatus] = useState(false);

//     useEffect(() => {
//         if (visible) {
//             loadAllData();
//             // Initialize from current shift if available
//             if (currentShift) {
//                 setSelectedBank(currentShift.default_bank_account ?? null);
//                 setSelectedCash(currentShift.default_cash_account ?? null);
//                 setSelectedCard(currentShift.default_card_account ?? null);
//                 // Note: fbr status might need to come from elsewhere or just be a toggle for the action
//             }
//         }
//     }, [visible, currentShift]);

//     const loadAllData = async () => {
//         setLoading(true);
//         try {
//             const [banks, cash, cards] = await Promise.all([
//                 fetchBankAccounts(),
//                 fetchCashAccounts(),
//                 fetchCreditCardAccounts()
//             ]);
//             setBankAccounts(banks);
//             setCashAccounts(cash);
//             setCreditCardAccounts(cards);
//         } catch (err) {
//             console.error("Failed to load settings data", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSave = async () => {
//         setSaving(true);
//         try {
//             // Update the local shift object before sending
//             if (currentShift) {
//                 currentShift.default_bank_account = selectedBank!;
//                 currentShift.default_cash_account = selectedCash!;
//                 currentShift.default_card_account = selectedCard!;
//             }

//             const success = await updateDefaultAccounts(fbrStatus);
//             if (success) {
//                 hideDialog();
//             } else {
//                 alert("Failed to update settings");
//             }
//         } catch (err) {
//             alert("Error saving settings");
//         } finally {
//             setSaving(false);
//         }
//     };

//     if (!visible) return null;

//     return (
//         <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={hideDialog}>
//             <View style={styles.overlay}>
//                 <View style={styles.container}>
//                     <View style={styles.header}>
//                         <Text style={styles.title}>POS Settings</Text>
//                         <TouchableOpacity onPress={hideDialog}>
//                             <FontAwesome5 name="times" size={ScreenUtil.width(20)} color="#666666" />
//                         </TouchableOpacity>
//                     </View>

//                     {loading ? (
//                         <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>
//                     ) : (
//                         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

//                             <Section title="Accounts Configuration">
//                                 <AccountPicker
//                                     label="Default Cash Account"
//                                     items={cashAccounts}
//                                     selectedValue={selectedCash}
//                                     onSelect={setSelectedCash}
//                                     idKey="cash_account_id"
//                                     nameKey="cash_account_name"
//                                 />
//                                 <AccountPicker
//                                     label="Default Bank Account"
//                                     items={bankAccounts}
//                                     selectedValue={selectedBank}
//                                     onSelect={setSelectedBank}
//                                     idKey="bank_account_id"
//                                     nameKey="bank_account_name"
//                                 />
//                                 <AccountPicker
//                                     label="Default Credit Card Account"
//                                     items={cardAccounts}
//                                     selectedValue={selectedCard}
//                                     onSelect={setSelectedCard}
//                                     idKey="credit_card_account_id"
//                                     nameKey="credit_card_account_name"
//                                 />
//                             </Section>

//                             {checkIfPermissionIsGranted('Allow FBR System') && (
//                                 <Section title="FBR Settings">
//                                     <View style={styles.settingRow}>
//                                         <Text style={styles.settingLabel}>FBR Status</Text>
//                                         <Switch
//                                             value={fbrStatus}
//                                             onValueChange={setFbrStatus}
//                                             trackColor={{ false: "#D1D1D1", true: COLORS.primary }}
//                                             thumbColor="#FFFFFF"
//                                         />
//                                     </View>
//                                 </Section>
//                             )}

//                             <View style={styles.footer}>
//                                 <TouchableOpacity
//                                     style={[styles.saveButton, saving && styles.disabledButton]}
//                                     onPress={handleSave}
//                                     disabled={saving}
//                                 >
//                                     {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
//                                 </TouchableOpacity>
//                             </View>
//                         </ScrollView>
//                     )}
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// const Section = ({ title, children }: any) => (
//     <View style={styles.section}>
//         <Text style={styles.sectionTitle}>{title}</Text>
//         {children}
//     </View>
// );

// const AccountPicker = ({ label, items, selectedValue, onSelect, idKey, nameKey }: any) => {
//     const [showOptions, setShowOptions] = useState(false);
//     const selectedItem = items.find((i: any) => i[idKey] === selectedValue);

//     return (
//         <View style={styles.pickerContainer}>
//             <Text style={styles.pickerLabel}>{label}</Text>
//             <TouchableOpacity style={styles.pickerTrigger} onPress={() => setShowOptions(true)}>
//                 <Text style={styles.pickerValue}>{selectedItem ? selectedItem[nameKey] : 'Select Account'}</Text>
//                 <FontAwesome5 name="chevron-down" size={14} color="#999" />
//             </TouchableOpacity>

//             <Modal visible={showOptions} transparent={true} animationType="fade">
//                 <TouchableOpacity style={styles.optionOverlay} activeOpacity={1} onPress={() => setShowOptions(false)}>
//                     <View style={styles.optionsList}>
//                         <ScrollView>
//                             {items.map((item: any) => (
//                                 <TouchableOpacity
//                                     key={item[idKey]}
//                                     style={styles.optionItem}
//                                     onPress={() => {
//                                         onSelect(item[idKey]);
//                                         setShowOptions(false);
//                                     }}
//                                 >
//                                     <Text style={[styles.optionText, item[idKey] === selectedValue && styles.selectedOptionText]}>
//                                         {item[nameKey]}
//                                     </Text>
//                                     {item[idKey] === selectedValue && <FontAwesome5 name="check" size={14} color={COLORS.primary} />}
//                                 </TouchableOpacity>
//                             ))}
//                         </ScrollView>
//                     </View>
//                 </TouchableOpacity>
//             </Modal>
//         </View>
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
//         maxHeight: ScreenUtil.height(700),
//         backgroundColor: '#F8F9FA',
//         borderRadius: ScreenUtil.width(15),
//         overflow: 'hidden',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: ScreenUtil.width(20),
//         backgroundColor: '#FFFFFF',
//         borderBottomWidth: 1,
//         borderBottomColor: '#EEEEEE',
//     },
//     title: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(20),
//         color: COLORS.primary,
//     },
//     center: {
//         height: ScreenUtil.height(300),
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     content: {
//         padding: ScreenUtil.width(20),
//     },
//     section: {
//         marginBottom: ScreenUtil.height(25),
//         backgroundColor: '#FFFFFF',
//         padding: ScreenUtil.width(15),
//         borderRadius: ScreenUtil.width(10),
//         borderWidth: 1,
//         borderColor: '#EEEEEE',
//     },
//     sectionTitle: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(16),
//         color: '#333333',
//         marginBottom: ScreenUtil.height(15),
//         borderLeftWidth: 3,
//         borderLeftColor: COLORS.primary,
//         paddingLeft: ScreenUtil.width(10),
//     },
//     pickerContainer: {
//         marginBottom: ScreenUtil.height(15),
//     },
//     pickerLabel: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#666666',
//         marginBottom: ScreenUtil.height(8),
//     },
//     pickerTrigger: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         height: ScreenUtil.height(45),
//         borderWidth: 1,
//         borderColor: '#DDDDDD',
//         borderRadius: ScreenUtil.width(8),
//         paddingHorizontal: ScreenUtil.width(12),
//         backgroundColor: '#FAFAFA',
//     },
//     pickerValue: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#333333',
//     },
//     settingRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: ScreenUtil.height(5),
//     },
//     settingLabel: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#444444',
//     },
//     footer: {
//         marginTop: ScreenUtil.height(10),
//         marginBottom: ScreenUtil.height(20),
//     },
//     saveButton: {
//         backgroundColor: COLORS.primary,
//         borderRadius: ScreenUtil.width(8),
//         height: ScreenUtil.height(50),
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     disabledButton: {
//         opacity: 0.7,
//     },
//     saveButtonText: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(16),
//         color: '#FFFFFF',
//     },
//     optionOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.3)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     optionsList: {
//         width: ScreenUtil.width(400),
//         maxHeight: ScreenUtil.height(400),
//         backgroundColor: '#FFFFFF',
//         borderRadius: ScreenUtil.width(10),
//         padding: ScreenUtil.width(10),
//         elevation: 10,
//     },
//     optionItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: ScreenUtil.height(15),
//         paddingHorizontal: ScreenUtil.width(15),
//         borderBottomWidth: 1,
//         borderBottomColor: '#F5F5F5',
//     },
//     optionText: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#333333',
//     },
//     selectedOptionText: {
//         fontFamily: 'Montserrat-Bold',
//         color: COLORS.primary,
//     },
// });
