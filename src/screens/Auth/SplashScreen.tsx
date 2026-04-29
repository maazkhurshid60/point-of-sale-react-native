import React from 'react';
import { View, Text, Image, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSplashController } from './hooks/useSplashController';
import { styles } from './SplashScreen.styles';

export const SplashScreen = () => {
  const { fadeAnim } = useSplashController();

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
};

export default SplashScreen;
