import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStore } from '../store/useNetworkStore';
import { COLORS } from '../constants/colors';

export default function InternetConnectivityStatusWidget() {
    const connectivityStatus = useNetworkStore((state) => state.connectivityStatus);
    const isInternetReachable = useNetworkStore((state) => state.isInternetReachable);

    if (connectivityStatus === 'online' && isInternetReachable) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {connectivityStatus === 'offline' ? 'No Connection' : 'Internet Unreachable'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: COLORS.posRed || '#B00020',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});
