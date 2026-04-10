import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import ErrorDialog from '../../components/dailogs/ErrorDialog';

import { COLORS } from '../../constants/colors';
import { LAYOUT } from '../../constants/appConstants';

const { width, height } = Dimensions.get('window');

export const SignInScreen = () => {
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
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        extraScrollHeight={30}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/svgs/poslogo.png')}
              style={styles.logo}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Sign In</Text>

          {/* Form */}
          <View style={{ marginTop: height * 0.02 }}>
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

            <View style={{ position: 'relative' }}>
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
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>SIGN IN</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <ErrorDialog
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </SafeAreaView>
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
    padding: width * 0.05,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: LAYOUT.cardRadius,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.04,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 500,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 34,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyText,
    paddingVertical: 12,
    fontSize: 18,
    marginBottom: 20,
    color: COLORS.posDark,
  },
  inputFocused: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
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
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: LAYOUT.buttonRadius,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});