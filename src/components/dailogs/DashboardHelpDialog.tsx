// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
// import { ScreenUtil } from '../../utils/ScreenUtil';
// import { COLORS } from '../../constants/colors';
// import { useDialogStore } from '../../store/useDialogStore';

// export default function DashboardHelpDialog() {
//     const { activeDialog, hideDialog } = useDialogStore();
//     const visible = activeDialog === 'DASHBOARD_HELP';

//     const helpSteps = [
//         "Select Store: Click on the store name to switch stores.",
//         "Open Shift: Enter the opening balance to start your day.",
//         "Make Sale: Select products and checkout to complete a sale.",
//         "Hold Sale: Pause a sale and resume it later from the Hold Sales menu.",
//         "Quotations: Create a quotation for a customer without completing a sale.",
//         "Return Sale: Process a return by selecting the original invoice.",
//         "Expenses: Record business expenses directly from the POS.",
//         "Reports: View daily reports and shift summaries."
//     ];

//     return (
//         <Modal
//             animationType="fade"
//             transparent={true}
//             visible={visible}
//             onRequestClose={hideDialog}
//         >
//             <TouchableOpacity 
//                 style={styles.overlay} 
//                 activeOpacity={1} 
//                 onPress={hideDialog}
//             >
//                 <View style={styles.container}>
//                     <Text style={styles.title}>Dashboard Help</Text>
//                     <ScrollView contentContainerStyle={styles.scrollContent}>
//                         {helpSteps.map((step, index) => (
//                             <View key={index} style={styles.stepContainer}>
//                                 <Text style={styles.stepText}>{`${index + 1}. ${step}`}</Text>
//                             </View>
//                         ))}
//                     </ScrollView>
//                     <TouchableOpacity style={styles.closeButton} onPress={hideDialog}>
//                         <Text style={styles.closeButtonText}>Close</Text>
//                     </TouchableOpacity>
//                 </View>
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
//         width: ScreenUtil.width(500),
//         maxHeight: ScreenUtil.height(600),
//         backgroundColor: '#FFFFFF',
//         borderRadius: ScreenUtil.width(15),
//         padding: ScreenUtil.width(20),
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
//     scrollContent: {
//         paddingBottom: ScreenUtil.height(20),
//     },
//     stepContainer: {
//         marginBottom: ScreenUtil.height(12),
//     },
//     stepText: {
//         fontFamily: 'Montserrat-Regular',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#333333',
//         lineHeight: ScreenUtil.height(22),
//     },
//     closeButton: {
//         backgroundColor: COLORS.primary,
//         borderRadius: ScreenUtil.width(8),
//         paddingVertical: ScreenUtil.height(12),
//         marginTop: ScreenUtil.height(10),
//         alignItems: 'center',
//     },
//     closeButtonText: {
//         fontFamily: 'Montserrat-SemiBold',
//         fontSize: ScreenUtil.setSpText(16),
//         color: '#FFFFFF',
//     },
// });
