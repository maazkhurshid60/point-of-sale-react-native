import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStore } from '../store/useNetworkStore';
import { COLORS } from '../constants/colors';

export default function InternetConnectivityStatusWidget() {
    const connectivityStatus = useNetworkStore((state) => state.connectivityStatus);
    const isInternetReachable = useNetworkStore((state) => state.isInternetReachable);

    const isOnline = connectivityStatus === 'online' && isInternetReachable !== false;

    return (
        <View style={[styles.container, isOnline ? styles.onlineContainer : styles.offlineContainer]}>
            <View style={[styles.dot, isOnline ? styles.onlineDot : styles.offlineDot]} />
            <Text style={styles.text}>
                {isOnline ? 'Online' : 'Offline'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    onlineContainer: {
        backgroundColor: 'rgba(76, 175, 80, 0.9)', // Soft green
    },
    offlineContainer: {
        backgroundColor: 'rgba(244, 67, 54, 0.9)', // Soft red
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    onlineDot: {
        backgroundColor: '#fff',
    },
    offlineDot: {
        backgroundColor: '#fff',
    },
    text: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
    },
});
