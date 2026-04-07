import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, ActivityIndicator, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasSeenOnboarding = useAuthStore((state) => state.hasSeenOnboarding);
  const isUserLoggedIn = useAuthStore((state) => state.isUserLoggedIn);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      delay: 500,
    }).start();

    // Navigation logic after 3 seconds
    const timer = setTimeout(() => {
      if (isUserLoggedIn) {
        navigation.replace('Dashboard');
      } else if (!hasSeenOnboarding) {
        navigation.replace('Onboarding');
      } else {
        navigation.replace('SignIn');
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [fadeAnim, hasSeenOnboarding, isUserLoggedIn, navigation]);

  return (
    <View style={styles.container}>
      {/* Background Decorations */}
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      <SafeAreaView style={styles.content}>
        <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
          <View style={styles.spacerTop} />

          <Image
            source={require('../../../assets/svgs/poslogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.textContainer}>
            <Text style={styles.appName}>OWNER'S INVENTORY</Text>
            <Text style={styles.tagline}>Elevating Business Management</Text>
          </View>

          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#7E57C2" />
          </View>

          <View style={styles.spacerBottom} />

          <Text style={styles.version}>v1.0.0</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FB',
  },
  topCircle: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(126, 87, 194, 0.05)',
  },
  bottomCircle: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(126, 87, 194, 0.03)',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacerTop: {
    flex: 3,
  },
  logo: {
    width: 160,
    height: 160,
  },
  textContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D2D2D',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9E9E9E',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  loaderContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  spacerBottom: {
    flex: 1,
  },
  version: {
    fontSize: 12,
    color: '#BDBDBD',
    marginBottom: 20,
  },
});
