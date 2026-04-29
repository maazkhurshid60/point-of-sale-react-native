// import React from 'react';
// import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';
// import { ScreenUtil } from '../../utils/ScreenUtil';
// import { COLORS } from '../../constants/colors';
// import { useAuthStore } from '../../store/useAuthStore';
// import { useDialogStore } from '../../store/useDialogStore';
// import { FontAwesome5 } from '@expo/vector-icons';

// export default function PersonalProfileDialog() {
//     const { activeDialog, hideDialog } = useDialogStore();
//     const { currentUser, currentStore } = useAuthStore();
//     const visible = activeDialog === 'PERSONAL_PROFILE';

//     if (!currentUser) return null;

//     return (
//         <Modal
//             animationType="slide"
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
//                     <Text style={styles.title}>Personal Profile</Text>

//                     <ScrollView contentContainerStyle={styles.scrollContent}>
//                         <View style={styles.profileHeader}>
//                             <View style={styles.imageContainer}>
//                                 {currentUser.image ? (
//                                     <Image
//                                         source={{ uri: currentUser.image }}
//                                         style={styles.profileImage}
//                                         resizeMode="cover"
//                                     />
//                                 ) : (
//                                     <View style={styles.placeholderImage}>
//                                         <FontAwesome5 name="user-circle" size={ScreenUtil.width(100)} color="#CCCCCC" />
//                                     </View>
//                                 )}
//                             </View>

//                             <View style={styles.infoContainer}>
//                                 <Text style={styles.userName}>{currentUser.name}</Text>
//                                 <Text style={styles.userId}>ID: {currentUser.user_Id}</Text>
//                                 <Text style={styles.storeName}>Store: {currentStore?.store_name || 'Not available'}</Text>

//                                 <View style={styles.divider} />

//                                 <View style={styles.contactItem}>
//                                     <FontAwesome5 name="phone-alt" size={ScreenUtil.setSpText(14)} color={COLORS.primary} />
//                                     <Text style={styles.contactText}>Contact: {currentUser.contact || 'Not available'}</Text>
//                                 </View>

//                                 <View style={styles.contactItem}>
//                                     <FontAwesome5 name="envelope" size={ScreenUtil.setSpText(14)} color={COLORS.primary} />
//                                     <Text style={styles.contactText}>Email: {currentUser.email || 'Not available'}</Text>
//                                 </View>
//                             </View>
//                         </View>
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
//         width: ScreenUtil.width(800),
//         maxHeight: ScreenUtil.height(600),
//         backgroundColor: '#EBEBEB',
//         borderRadius: ScreenUtil.width(15),
//         padding: ScreenUtil.width(40),
//         elevation: 5,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//     },
//     title: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(30),
//         color: COLORS.primary,
//         marginBottom: ScreenUtil.height(30),
//         textAlign: 'center',
//     },
//     scrollContent: {
//         flexGrow: 1,
//     },
//     profileHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     imageContainer: {
//         width: ScreenUtil.width(250),
//         height: ScreenUtil.width(250),
//         backgroundColor: '#D9D9D9',
//         borderRadius: ScreenUtil.width(15),
//         overflow: 'hidden',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     profileImage: {
//         width: '100%',
//         height: '100%',
//     },
//     placeholderImage: {
//         width: '100%',
//         height: '100%',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     infoContainer: {
//         flex: 1,
//         marginLeft: ScreenUtil.width(40),
//         justifyContent: 'center',
//     },
//     userName: {
//         fontFamily: 'Montserrat-Bold',
//         fontSize: ScreenUtil.setSpText(28),
//         color: '#4B5C69',
//         marginBottom: ScreenUtil.height(5),
//     },
//     userId: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(18),
//         color: '#4B5C69',
//         marginBottom: ScreenUtil.height(5),
//     },
//     storeName: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(18),
//         color: '#4B5C69',
//         marginBottom: ScreenUtil.height(15),
//     },
//     divider: {
//         height: 1,
//         backgroundColor: '#CCCCCC',
//         marginVertical: ScreenUtil.height(15),
//     },
//     contactItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: ScreenUtil.height(10),
//     },
//     contactText: {
//         fontFamily: 'Montserrat-Medium',
//         fontSize: ScreenUtil.setSpText(18),
//         color: '#4B5C69',
//         marginLeft: ScreenUtil.width(10),
//     },
//     closeButton: {
//         backgroundColor: COLORS.primary,
//         borderRadius: ScreenUtil.width(8),
//         paddingVertical: ScreenUtil.height(15),
//         marginTop: ScreenUtil.height(30),
//         alignItems: 'center',
//     },
//     closeButtonText: {
//         fontFamily: 'Montserrat-SemiBold',
//         fontSize: ScreenUtil.setSpText(18),
//         color: '#FFFFFF',
//     },
// });
