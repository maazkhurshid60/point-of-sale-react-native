// import React from 'react';
// import {
//     View,
//     Text,
//     Modal,
//     TouchableOpacity,
//     StyleSheet,
//     Dimensions,
// } from 'react-native';

// import { COLORS } from '../../constants/colors';
// import { LAYOUT } from '../../constants/appConstants';

// const { width } = Dimensions.get('window');

// export default function WebNotificationDialogbox({ visible, title, body, onClose }: any) {
//     return (
//         <Modal
//             transparent
//             visible={visible}
//             animationType="fade"
//         >
//             <View style={styles.overlay}>
//                 <View style={styles.dialog}>

//                     {/* Title */}
//                     <Text style={styles.title}>
//                         Message From {title}
//                     </Text>

//                     {/* Body */}
//                     <Text style={styles.body}>
//                         {body}
//                     </Text>

//                     {/* Button */}
//                     <TouchableOpacity style={styles.button} onPress={onClose}>
//                         <Text style={styles.buttonText}>Close</Text>
//                     </TouchableOpacity>

//                 </View>
//             </View>
//         </Modal>
//     );
// }

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     dialog: {
//         width: '85%',
//         backgroundColor: COLORS.white,
//         borderRadius: LAYOUT.cardRadius,
//         padding: 20,
//         elevation: 8,
//     },

//     title: {
//         fontSize: width * 0.05,
//         fontWeight: '600',
//         color: COLORS.primary,
//         marginBottom: 10,
//     },

//     body: {
//         fontSize: width * 0.04,
//         color: '#444',
//         marginBottom: 20,
//     },

//     button: {
//         alignSelf: 'flex-end',
//         paddingVertical: 8,
//         paddingHorizontal: 15,
//         borderRadius: 6,
//         borderWidth: 1,
//         borderColor: COLORS.primary,
//     },

//     buttonText: {
//         color: COLORS.primary,
//         fontWeight: '500',
//     },
// });