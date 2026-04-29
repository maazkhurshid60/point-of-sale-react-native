import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ErrorDialog from '../../components/dialogs/ErrorDialog';
import { COLORS } from '../../constants/colors';
import { useForgotPasswordController } from './hooks/useForgotPasswordController';
import { styles } from './ForgotPasswordScreen.styles';

export const ForgotPasswordScreen = () => {
  const {
    windowWidth,
    windowHeight,
    isTabletLandscape,
    navigation,
    email,
    isLoading,
    errorVisible,
    errorMessage,
    activeInput,
    setEmail,
    setErrorVisible,
    setActiveInput,
    handleSend,
  } = useForgotPasswordController();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, '#4F46E5']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { padding: windowWidth * 0.05 }
          ]}
          enableOnAndroid={true}
          extraScrollHeight={30}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[
            styles.card,
            isTabletLandscape && styles.cardTabletLandscape,
            { maxWidth: isTabletLandscape ? 900 : 500 }
          ]}>

            <View style={[
              isTabletLandscape ? styles.rowLayout : styles.columnLayout
            ]}>

              {/* Branding Section (Left on Tablet) */}
              <View style={[
                styles.brandingSection,
                isTabletLandscape && styles.brandingSectionTablet
              ]}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <FontAwesome6 name="arrow-left" size={20} color={isTabletLandscape ? COLORS.primary : COLORS.white} />
                  {!isTabletLandscape && <Text style={styles.backTextMobile}>Back</Text>}
                </TouchableOpacity>

                <View style={[
                  styles.logoContainer,
                  isTabletLandscape && { marginBottom: 20 }
                ]}>
                  <Image
                    source={require('../../../assets/svgs/poslogo.png')}
                    style={[
                      styles.logo,
                      {
                        width: isTabletLandscape ? 180 : Math.min(windowWidth, windowHeight) * 0.3,
                        height: isTabletLandscape ? 180 : Math.min(windowWidth, windowHeight) * 0.3,
                      }
                    ]}
                  />
                </View>
                {!isTabletLandscape && <Text style={styles.title}>Forgot Password</Text>}
                {isTabletLandscape && (
                  <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeTitle}>Reset Password</Text>
                    <Text style={styles.welcomeSubtitle}>Don't worry, it happens. Enter your email to get back to managing your business.</Text>
                  </View>
                )}
              </View>

              {/* Form Section */}
              <View style={[
                styles.formSection,
                isTabletLandscape && styles.formSectionTablet
              ]}>
                {isTabletLandscape && <Text style={[styles.title, { textAlign: 'left', marginBottom: 10 }]}>Forgot Password</Text>}
                <Text style={styles.subtitle}>
                  Enter your registered email address to receive instructions
                </Text>

                <View style={styles.inputContainer}>
                  <FontAwesome6 name="envelope" size={16} color={activeInput === 'email' ? COLORS.primary : COLORS.greyText} style={styles.inputIcon} />
                  <TextInput
                    style={[
                      styles.input,
                      activeInput === 'email' && styles.inputFocused
                    ]}
                    placeholder="Enter email"
                    placeholderTextColor={COLORS.greyText}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setActiveInput('email')}
                    onBlur={() => setActiveInput('')}
                  />
                </View>

                {/* Button */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSend}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={[COLORS.primary, '#4F46E5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>SEND INSTRUCTIONS</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ marginTop: 20, alignItems: 'center' }}
                >
                  <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Back to Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>

      <ErrorDialog
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
};

export default ForgotPasswordScreen;