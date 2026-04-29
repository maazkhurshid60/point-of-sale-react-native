// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
// import { ScreenUtil } from '../../utils/ScreenUtil';
// import { COLORS } from '../../constants/colors';
// import { useDialogStore } from '../../store/useDialogStore';

// export default function RestaurantHelpDialog() {
//     const { activeDialog, hideDialog } = useDialogStore();
//     const visible = activeDialog === 'RESTAURANT_HELP';

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
//                     <ScrollView contentContainerStyle={styles.scrollContent}>
//                         <Section title="Floor Controls">
//                             <Item text="1. Floor and Text field for Floor name" />
//                             <Item text="2. Capacity and Text field for enter Table Capacity on Current Floor" />
//                             <Item text="3. Floor ➖ symbol used to remove floor" />
//                             <Item text="4. Floor ➕ symbol used to add new floor" />
//                             <Item text="5. From Drop down you can change the location of tables from one floor to other." />
//                         </Section>

//                         <Section title="Table Controls">
//                             <Item text="1. Name and Text field for Table name. You can change table name" />
//                             <Item text="2. X-axis and Y-axis ➖ symbol decrease table location" />
//                             <Item text="3. X-axis and Y-axis ➕ symbol increase table location" />
//                             <Item text="4. Height and width ➖ symbol decrease table hegiht and width" />
//                             <Item text="5. Height and width ➕ symbol increase table hegiht and width" />
//                             <Item text="6. Chairs ➖ symbol remove chair from current table" />
//                             <Item text="7. Chair ➕ symbol add chair to current table" />
//                             <Item text="8. Table ➖ symbol remove Table from current Floor" />
//                             <Item text="9. Table ➕ symbol add Table to current Floor" />
//                             <Item text="10. Rotation slider symbol Rotate table" />
//                             <Item text="11. Long Press on table then you can drag and drop as well" />
//                         </Section>

//                         <Section title="Decoration Controls">
//                             <Item text="1. Name and Text field for Leaf name. You can change Leaf name" />
//                             <Item text="2. X-axis and Y-axis ➖ symbol decrease location of table" />
//                             <Item text="3. Leaf ➖ symbol remove Leaf from current Floor" />
//                             <Item text="4. Leaf ➕ symbol add Leaf to current Floor" />
//                         </Section>

//                         <Section title="Keyboard Shortcuts">
//                             <Item text="1. Keyboard Key (A): To add Table" />
//                             <Item text="2. Keyboard Key (D): To Delete Table" />
//                             <Item text="3. Keyboard Key (CTRL+E): Back to Home" />
//                         </Section>

//                         <Section title="Operations">
//                             <Item text="SAVE: To save changes press save button" boldTitle="SAVE: " />
//                             <Item text="CANCEL: To discard changes press cancel button" boldTitle="CANCEL: " />
//                         </Section>
//                     </ScrollView>
//                     <TouchableOpacity style={styles.closeButton} onPress={hideDialog}>
//                         <Text style={styles.closeButtonText}>Close</Text>
//                     </TouchableOpacity>
//                 </View>
//             </TouchableOpacity>
//         </Modal>
//     );
// };

// const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
//     <View style={styles.section}>
//         <Text style={styles.sectionTitle}>{title}</Text>
//         {children}
//     </View>
// );

// const Item = ({ text, boldTitle }: { text: string, boldTitle?: string }) => (
//     <View style={styles.item}>
//         <Text style={styles.itemText}>
//             {boldTitle ? (
//                 <Text style={styles.bold}>{boldTitle}</Text>
//             ) : null}
//             {text.replace(boldTitle || '', '')}
//         </Text>
//     </View>
// );

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     container: {
//         width: ScreenUtil.width(600),
//         maxHeight: ScreenUtil.height(800),
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
//         marginBottom: ScreenUtil.height(15),
//         textAlign: 'center',
//     },
//     scrollContent: {
//         paddingBottom: ScreenUtil.height(20),
//     },
//     section: {
//         marginBottom: ScreenUtil.height(20),
//     },
//     sectionTitle: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(18),
//         color: '#333333',
//         marginBottom: ScreenUtil.height(10),
//         borderBottomWidth: 1,
//         borderBottomColor: '#EEEEEE',
//         paddingBottom: ScreenUtil.height(5),
//     },
//     item: {
//         marginBottom: ScreenUtil.height(8),
//     },
//     itemText: {
//         fontFamily: 'Montserrat-Regular',
//         fontSize: ScreenUtil.setSpText(14),
//         color: '#666666',
//         lineHeight: ScreenUtil.height(20),
//     },
//     bold: {
//         fontFamily: 'Montserrat-Bold',
//         color: '#333333',
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
