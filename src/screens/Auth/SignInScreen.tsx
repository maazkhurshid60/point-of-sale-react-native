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
import { useAuthStore } from '../../store/useAuthStore';
import ErrorDialog from '../../components/dailogs/ErrorDialog';
import { COLORS } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SignInScreen = () => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isTablet = windowWidth > 800;
  const isLandscape = windowWidth > windowHeight;
  const isTabletLandscape = isTablet && isLandscape;

  const navigation = useNavigation();

  const [clientCode, setClientCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isObscure, setIsObscure] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeInput, setActiveInput] = useState('');

  const signIn = useAuthStore((state) => state.signIn);

  const handleLogin = async () => {
    if (!clientCode || !username || !password) return;

    setIsLoading(true);
    try {
      const success = await signIn(clientCode, username, password);
      if (!success) {
        setErrorMessage("Invalid Credentials or network issue.");
        setErrorVisible(true);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setErrorVisible(true);
    } finally {
      setIsLoading(false);
    }
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
              {/* Branding Section */}
              <View style={[
                styles.brandingSection,
                isTabletLandscape && styles.brandingSectionTablet
              ]}>
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
                {!isTabletLandscape && <Text style={styles.title}>Sign In</Text>}
                {isTabletLandscape && (
                  <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeTitle}>Inventory Pro</Text>
                    <Text style={styles.welcomeSubtitle}>Manage your business with ease and precision from any device.</Text>
                  </View>
                )}
              </View>

              {/* Form Section */}
              <View style={[
                styles.formSection,
                isTabletLandscape && styles.formSectionTablet
              ]}>
                {isTabletLandscape && <Text style={[styles.title, { textAlign: 'left', marginBottom: 30 }]}>Sign In</Text>}

                <View>
                  <View style={styles.inputContainer}>
                    <FontAwesome6 name="hashtag" size={16} color={activeInput === 'clientCode' ? COLORS.primary : COLORS.greyText} style={styles.inputIcon} />
                    <TextInput
                      style={[
                        styles.input,
                        activeInput === 'clientCode' && styles.inputFocused
                      ]}
                      placeholder="Client Code"
                      placeholderTextColor={COLORS.greyText}
                      value={clientCode}
                      onChangeText={setClientCode}
                      keyboardType="numeric"
                      returnKeyType="next"
                      onFocus={() => setActiveInput('clientCode')}
                      onBlur={() => setActiveInput('')}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <FontAwesome6 name="user" size={16} color={activeInput === 'username' ? COLORS.primary : COLORS.greyText} style={styles.inputIcon} />
                    <TextInput
                      style={[
                        styles.input,
                        activeInput === 'username' && styles.inputFocused
                      ]}
                      placeholder="Username"
                      placeholderTextColor={COLORS.greyText}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      returnKeyType="next"
                      onFocus={() => setActiveInput('username')}
                      onBlur={() => setActiveInput('')}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <FontAwesome6 name="lock" size={16} color={activeInput === 'password' ? COLORS.primary : COLORS.greyText} style={styles.inputIcon} />
                    <View style={{ flex: 1, position: 'relative' }}>
                      <TextInput
                        style={[
                          styles.input,
                          activeInput === 'password' && styles.inputFocused,
                          { paddingRight: 50 }
                        ]}
                        placeholder="Password"
                        placeholderTextColor={COLORS.greyText}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={isObscure}
                        returnKeyType="done"
                        onFocus={() => setActiveInput('password')}
                        onBlur={() => setActiveInput('')}
                        onSubmitEditing={handleLogin}
                      />

                      <TouchableOpacity
                        onPress={() => setIsObscure(!isObscure)}
                        style={styles.showHide}
                      >
                        <Text style={styles.showHideText}>
                          {isObscure ? 'Show' : 'Hide'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Remember + Forgot */}
                  <View style={styles.rowBetween}>
                    <TouchableOpacity
                      onPress={() => setRememberMe(!rememberMe)}
                      style={styles.rememberContainer}
                    >
                      <View style={[
                        styles.checkbox,
                        rememberMe && styles.checkboxActive
                      ]} />
                      <Text style={styles.rememberText}>Remember me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigation.navigate("ForgotPassword" as never)}
                    >
                      <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Button */}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
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
                      <Text style={styles.buttonText}>SIGN IN</Text>
                    )}
                  </TouchableOpacity>
                </View>
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
  },
  brandingSectionTablet: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 40,
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 10,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
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
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Handled by container
  },
  showHide: {
    position: 'absolute',
    right: 0,
    top: 12,
  },
  showHideText: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 35,
    marginTop: 5,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    color: COLORS.greyText,
    fontSize: 16,
    marginLeft: 8,
  },
  forgotText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#A0A0A0',
    borderRadius: 3,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});