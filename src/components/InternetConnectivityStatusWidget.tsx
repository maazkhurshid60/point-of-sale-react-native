import React from 'react';
import { Text, StyleSheet, useWindowDimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
    useAnimatedStyle, 
    useSharedValue, 
    withSpring,
    runOnJS
} from 'react-native-reanimated';
import { useNetworkStore } from '../store/useNetworkStore';

export default function InternetConnectivityStatusWidget() {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const connectivityStatus = useNetworkStore((state) => state.connectivityStatus);
    const isInternetReachable = useNetworkStore((state) => state.isInternetReachable);
    const widgetX = useNetworkStore((state) => state.widgetX);
    const widgetY = useNetworkStore((state) => state.widgetY);
    const setWidgetPosition = useNetworkStore((state) => state.setWidgetPosition);

    const isOnline = connectivityStatus === 'online' && isInternetReachable !== false;

    // Shared values for animation. 
    // translateX/Y are offsets from bottom-right (0,0)
    const translateX = useSharedValue(-widgetX);
    const translateY = useSharedValue(-widgetY);
    const contextX = useSharedValue(0);
    const contextY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            contextX.value = translateX.value;
            contextY.value = translateY.value;
        })
        .onUpdate((event) => {
            translateX.value = contextX.value + event.translationX;
            translateY.value = contextY.value + event.translationY;
        })
        .onEnd(() => {
            // Determine nearest horizontal edge
            // translateX 0 is right edge, translateX -windowWidth is left edge
            const midPointX = -windowWidth / 2;
            const snapX = translateX.value > midPointX ? -20 : -(windowWidth - 100);

            // Determine nearest vertical edge
            // translateY 0 is bottom edge, translateY -windowHeight is top edge
            const midPointY = -windowHeight / 2;
            const snapY = translateY.value > midPointY ? -25 : -(windowHeight - 60);

            // Animate to the snap point
            translateX.value = withSpring(snapX);
            translateY.value = withSpring(snapY);

            // Save the final snapped position
            runOnJS(setWidgetPosition)(-snapX, -snapY);
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        };
    });

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View 
                style={[
                    styles.container, 
                    animatedStyle,
                    isOnline ? styles.onlineContainer : styles.offlineContainer
                ]}
            >
                <Text style={styles.dot}>
                    {isOnline ? '●' : '○'}
                </Text>
                <Text style={styles.text}>
                    {isOnline ? 'Online' : 'Offline'}
                </Text>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        zIndex: 999999,
    },
    onlineContainer: {
        backgroundColor: '#4CAF50',
    },
    offlineContainer: {
        backgroundColor: '#F44336',
    },
    dot: {
        color: 'white',
        marginRight: 6,
        fontSize: 14,
    },
    text: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
    },
});
