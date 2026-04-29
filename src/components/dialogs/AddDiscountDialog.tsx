import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
    Keyboard,
} from 'react-native';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useCartStore } from '../../store/useCartStore';
import { COLORS } from '../../constants/colors';
import { CartItemModel } from '../../models';

interface AddDiscountDialogProps {
    cartItem: CartItemModel;
    onClose: () => void;
}

export default function AddDiscountDialog({ cartItem, onClose }: AddDiscountDialogProps) {
    const { width, height } = useWindowDimensions();
    const isPortrait = height > width;

    const softwareSettings = useSettingsStore((state) => state.softwareSettings);
    const applyDiscountOnASingleProductPrice = useCartStore((state) => state.applyDiscountOnASingleProductPrice);

    const [discountValue, setDiscountValue] = useState('');

    const currencySymbol = softwareSettings?.currency_symbol || '$';
    const discountTypeLabel = softwareSettings?.discount_type === 'amount' ? currencySymbol : '%';

    useEffect(() => {
        if (cartItem.discount !== 0) {
            setDiscountValue(cartItem.discount.toString());
        }
    }, [cartItem.discount]);

    const handleOkay = () => {
        try {
            applyDiscountOnASingleProductPrice(cartItem, discountValue);
            setDiscountValue('');
            Keyboard.dismiss();
            onClose();
        } catch (e: any) {
            // Typically we'd use showDialog('ERROR', { errorMessage: e.toString() }) here
            // but since we are already in a dialog, we can just alert or handle gracefully
            alert(e.toString());
        }
    };

    return (
        <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 500 }]}>
            <Text style={styles.title}>
                Add Discount({discountTypeLabel})
            </Text>

            <View style={styles.inputContainer}>
                <TextInput
                    value={discountValue}
                    onChangeText={setDiscountValue}
                    placeholder="discount"
                    placeholderTextColor="rgba(142, 142, 142, 0.5)"
                    keyboardType="numeric"
                    style={styles.input}
                    autoFocus
                    maxLength={7}
                    textAlign="center"
                    onSubmitEditing={handleOkay}
                />
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={onClose}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.okBtn}
                    onPress={handleOkay}
                >
                    <Text style={styles.okText}>Okay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dialogCard: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 24,
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.primary,
        fontFamily: 'Montserrat',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        width: '80%',
        marginBottom: 40,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(196, 196, 196, 1)',
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.primary,
        fontFamily: 'Montserrat',
        paddingVertical: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 6,
    },
    okBtn: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: COLORS.primary,
        borderRadius: 6,
    },
    cancelText: {
        color: COLORS.greyText,
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Montserrat',
    },
    okText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Montserrat',
    },
});
