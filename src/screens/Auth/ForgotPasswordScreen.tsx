import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import ErrorDialog from '../../components/dailogs/ErrorDialog';
import { COLORS } from '../../constants/colors';

export default function ForgotPasswordScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isTablet = windowWidth > 800;
  const isLandscape = windowWidth > windowHeight;
  const isTabletLandscape = isTablet && isLandscape;

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeInput, setActiveInput] = useState('');

  const handleSend = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address.");
      setErrorVisible(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setErrorVisible(true);
      return;
    }

    setIsLoading(true);
    // Mimic API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    setErrorMessage("If an account exists with this email, you will receive reset instructions.");
    setErrorVisible(true);
  };

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 35,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    alignSelf: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  cardTabletLandscape: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  rowLayout: {
    flexDirection: 'row',
    minHeight: 450,
  },
  columnLayout: {
    flexDirection: 'column',
  },
  brandingSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  brandingSectionTablet: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 40,
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
    paddingTop: 40,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  formSectionTablet: {
    flex: 1.2,
    padding: 50,
    justifyContent: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 250,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    resizeMode: 'contain',
  },
  title: {
    fontSize: 34,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.greyText,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyText,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 18,
    color: COLORS.posDark,
  },
  inputFocused: {
    borderBottomColor: COLORS.primary,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backTextMobile: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600'
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});