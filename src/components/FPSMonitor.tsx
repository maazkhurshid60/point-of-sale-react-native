import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export default function FPSMonitor() {
    const [fps, setFps] = useState(60);
    const frames = useRef(0);
    const lastTime = useRef(Date.now());
    const requestRef = useRef<number>(null);

    useEffect(() => {
        const calcFps = () => {
            frames.current++;
            const currentTime = Date.now();

            if (currentTime >= lastTime.current + 1000) {
                setFps(frames.current);
                frames.current = 0;
                lastTime.current = currentTime;
            }

            requestRef.current = requestAnimationFrame(calcFps);
        };

        requestRef.current = requestAnimationFrame(calcFps);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    // Color based on performance
    const getFpsColor = () => {
        if (fps >= 55) return '#4CAF50'; // Great
        if (fps >= 40) return '#FFEB3B'; // Okay
        return '#F44336'; // Poor
    };

    return (
        <View style={styles.container}>
            <View style={[styles.dot, { backgroundColor: getFpsColor() }]} />
            <Text style={styles.text}>{fps} FPS</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 30 : 50,
        right: 10,

        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1000000,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    text: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
});
