// import React, { useState } from "react";
// import {
//     Modal,
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     Keyboard,
// } from "react-native";

// import { useCartStore } from "../../store/useCartStore";
// import { ProductModel } from "../../models";

// export default function CustomProductQuantityModal({
//     onClose,
//     product,
// }: {
//     onClose: () => void;
//     product: ProductModel;
// }) {
//     const [qty, setQty] = useState("");

//     const bulkQtyIncrement = useCartStore(
//         (state) => state.bulkQtyIncrement
//     );

//     const handleSubmit = () => {
//         try {
//             if (!qty || qty.trim() === "") return;

//             bulkQtyIncrement(qty, product);

//             setQty("");
//             Keyboard.dismiss();
//             onClose();
//         } catch (e: any) {
//             alert(e.message || e.toString());
//         }
//     };

//     return (
//         <View style={styles.dialog}>
//             <Text style={styles.title}>Add Product Quantity</Text>

//             <TextInput
//                 value={qty}
//                 onChangeText={setQty}
//                 placeholder="Qty"
//                 keyboardType="numeric"
//                 style={styles.input}
//                 autoFocus
//                 maxLength={7}
//                 onSubmitEditing={handleSubmit}
//             />

//             <View style={styles.buttonRow}>
//                 <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
//                     <Text style={styles.cancelText}>Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.okBtn} onPress={handleSubmit}>
//                     <Text style={styles.okText}>Okay</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }


// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     dialog: {
//         width: "85%",
//         backgroundColor: "#fff",
//         borderRadius: 15,
//         padding: 20,
//         alignItems: "center",
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: "700",
//         marginBottom: 20,
//         color: "#6C2BD9",
//     },
//     input: {
//         width: "60%",
//         borderWidth: 1,
//         borderColor: "#ccc",
//         borderRadius: 8,
//         textAlign: "center",
//         fontSize: 18,
//         padding: 10,
//         marginBottom: 20,
//     },
//     buttonRow: {
//         flexDirection: "row",
//         gap: 10,
//     },
//     cancelBtn: {
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderWidth: 1,
//         borderColor: "#6C2BD9",
//         borderRadius: 6,
//     },
//     okBtn: {
//         paddingVertical: 10,
//         paddingHorizontal: 25,
//         backgroundColor: "#6C2BD9",
//         borderRadius: 6,
//     },
//     cancelText: {
//         color: "#555",
//         fontWeight: "500",
//     },
//     okText: {
//         color: "#fff",
//         fontWeight: "600",
//     },
// });