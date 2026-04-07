// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
// import { ScreenUtil } from '../../utils/ScreenUtil';
// import { COLORS } from '../../constants/colors';
// import { useDialogStore } from '../../store/useDialogStore';

// export default function HelpDialog() {
//     const { activeDialog, hideDialog } = useDialogStore();
//     const visible = activeDialog === 'HELP';

//     const shortcuts = [
//         "A: Open add product dialog",
//         "C: Clear the cart",
//         "H: Make hold sale",
//         "P: Open partial payment screen",
//         "T: Open Table System screen",
//         "S: Open side categories menu",
//         "B: Open barcode scanning",
//         "Enter: Make cash sale",
//         "Arrow Key (R): Open right side menu",
//         "Arrow Key (L): Open left side menu",
//         "Ctrl + S: Make sample sale",
//         "Ctrl + Q: Make quotation sale",
//         "Ctrl + B: Print raw bill",
//         "Ctrl + C: Open coupon section",
//         "Shift + Space: Open Chat"
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
//                     <Text style={styles.title}>Help</Text>
//                     <Text style={styles.subtitle}>Keyboard Shortcuts</Text>
//                     <ScrollView contentContainerStyle={styles.scrollContent}>
//                         {shortcuts.map((shortcut, index) => (
//                             <View key={index} style={styles.shortcutContainer}>
//                                 <Text style={styles.shortcutText}>{`${index + 1}. ${shortcut}`}</Text>
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
//         maxHeight: ScreenUtil.height(700),
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
//         marginBottom: ScreenUtil.height(10),
//         textAlign: 'center',
//     },
//     subtitle: {
//         fontFamily: 'Montserrat-SemiBold',
//         fontSize: ScreenUtil.setSpText(18),
//         color: '#666666',
//         marginBottom: ScreenUtil.height(20),
//         textAlign: 'center',
//     },
//     scrollContent: {
//         paddingBottom: ScreenUtil.height(20),
//     },
//     shortcutContainer: {
//         marginBottom: ScreenUtil.height(8),
//     },
//     shortcutText: {
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
