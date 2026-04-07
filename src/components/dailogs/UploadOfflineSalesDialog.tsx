// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
// import { COLORS } from '../../constants/colors';

// interface UploadOfflineSalesDialogProps {
//   onClose?: () => void;
// }

// export default function UploadOfflineSalesDialog({ onClose }: UploadOfflineSalesDialogProps) {
//   const { width, height } = useWindowDimensions();
//   const isPortrait = height > width;

//   return (
//     <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 500 }]}>
//       <Text style={styles.title}>Upload Offline Sales</Text>
//       <Text style={styles.subtitle}>Sync progress will appear here</Text>
//       <View style={styles.actions}>
//         <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
//           <Text style={styles.cancelText}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   dialogCard: { backgroundColor: COLORS.white, borderRadius: 15, padding: 30, alignSelf: 'center', elevation: 5 },
//   title: { fontSize: 20, fontWeight: '700', color: COLORS.primary, fontFamily: 'Montserrat', marginBottom: 10, textAlign: 'center' },
//   subtitle: { fontSize: 14, color: COLORS.textDark, fontFamily: 'Montserrat', marginBottom: 20, textAlign: 'center' },
//   actions: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
//   cancelBtn: { backgroundColor: '#dc3545', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 6 },
//   cancelText: { color: COLORS.white, fontSize: 16, fontWeight: '500', fontFamily: 'Montserrat' },
// });
