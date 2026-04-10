import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';

interface ErrorDialogProps {
    visible: boolean;
    errorMessage: string;
    onClose: () => void;
}

const PRIMARY_COLOR = "#6A1B9A";
const RED_COLOR = "rgba(252, 96, 66, 1)";
const TEXT_COLOR = "rgba(66, 66, 66, 1)"; // Equivalent to Colors.grey.shade800
const OVERLAY_COLOR = "rgba(0, 0, 0, 0.5)";

export default function ErrorDialog({ visible, errorMessage, onClose }: ErrorDialogProps) {
    const { width, height } = useWindowDimensions();
    const isPortrait = height > width;

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={[styles.dialogCard, { maxWidth: isPortrait ? '80%' : 500 }]}>
                    <Text style={[styles.title, { fontSize: isPortrait ? 24 : 18 }]}>Opps!</Text>
                    <View style={[styles.contentContainer, { minHeight: isPortrait ? 80 : 100 }]}>
                        <Text style={[styles.message, { fontSize: isPortrait ? 18 : 14 }]}>{errorMessage}</Text>
                    </View>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.buttonPadding}>
                            <Text style={[styles.okText, { fontSize: isPortrait ? 20 : 16 }]}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: OVERLAY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogCard: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        color: RED_COLOR,
        fontWeight: '600',
        marginBottom: 16,
        fontFamily: 'Montserrat', // Ensuring we map exactly to the flutter requests if loaded, else fallback to standard
    },
    contentContainer: {
        justifyContent: 'flex-start',
        marginBottom: 24,
    },
    message: {
        color: TEXT_COLOR,
        fontFamily: 'Montserrat',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttonPadding: {
        padding: 8,
    },
    okText: {
        color: PRIMARY_COLOR,
        fontWeight: '500',
        fontFamily: 'Montserrat',
    }
});
