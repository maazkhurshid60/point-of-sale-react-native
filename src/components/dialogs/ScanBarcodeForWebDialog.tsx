import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScreenUtil } from '../../utils/ScreenUtil';
import { COLORS } from '../../constants/colors';
import { useCartStore } from '../../store/useCartStore';
import { useDialogStore } from '../../store/useDialogStore';

export default function ScanBarcodeForWebDialog() {
    const { activeDialog, hideDialog } = useDialogStore();
    const { addProductByUPCIDBarcode } = useCartStore();
    const visible = activeDialog === 'SCAN_BARCODE_WEB';

    const [barcode, setBarcode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (visible) {
            // Focus the input when the dialog opens
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setBarcode('');
            setError(null);
            setIsLoading(false);
        }
    }, [visible]);

    const handleSubmit = async () => {
        if (!barcode.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            await addProductByUPCIDBarcode(barcode.trim());
            setBarcode('');
            // Keep the focus for the next scan
            inputRef.current?.focus();
        } catch (err: any) {
            setError(err.message || 'Product not found');
            inputRef.current?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={hideDialog}
        >
            <TouchableOpacity
                style={styles.container}
                activeOpacity={1}
            >
                <Text style={styles.title}>Scan Barcode</Text>
                <Text style={styles.subtitle}>Use your hand held Barcode Scanner device to scan.</Text>

                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={barcode}
                    onChangeText={setBarcode}
                    onSubmitEditing={handleSubmit}
                    placeholder="Scan or type barcode..."
                    autoFocus={true}
                    returnKeyType="search"
                    placeholderTextColor="#9ca3af"
                />

                <View style={styles.statusContainer}>
                    {isLoading && <ActivityIndicator color={COLORS.primary} size="large" />}
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>

                <TouchableOpacity style={styles.closeButton} onPress={hideDialog}>
                    <Text style={styles.closeButtonText}>Done</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        // backgroundColor: 'rgba(0,0,0,0.5)', // Managed by GlobalDialogManager
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: ScreenUtil.width(500),
        backgroundColor: '#FFFFFF',
        borderRadius: ScreenUtil.width(15),
        padding: ScreenUtil.width(30),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Montserrat',
        fontSize: ScreenUtil.setSpText(24),
        color: COLORS.primary,
        fontWeight: 'bold',
        marginBottom: ScreenUtil.height(5),
    },
    subtitle: {
        fontFamily: 'Montserrat',
        fontSize: ScreenUtil.setSpText(14),
        color: '#666666',
        marginBottom: ScreenUtil.height(28),
        textAlign: 'center',
    },
    input: {
        width: ScreenUtil.width(400),
        height: ScreenUtil.height(60),
        borderBottomWidth: 2,
        marginTop: 20,
        borderBottomColor: COLORS.primary,
        fontFamily: 'Montserrat',
        fontSize: ScreenUtil.setSpText(18),
        textAlign: 'center',
        color: '#333333',
    },
    statusContainer: {
        height: ScreenUtil.height(60),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: ScreenUtil.height(20),
    },
    errorText: {
        fontFamily: 'Montserrat',
        fontSize: ScreenUtil.setSpText(14),
        color: '#FF0000',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: COLORS.primary,
        borderRadius: ScreenUtil.width(8),
        paddingVertical: ScreenUtil.height(12),
        paddingHorizontal: ScreenUtil.width(40),
        marginTop: ScreenUtil.height(10),
    },
    closeButtonText: {
        fontFamily: 'Montserrat',
        fontSize: ScreenUtil.setSpText(16),
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
