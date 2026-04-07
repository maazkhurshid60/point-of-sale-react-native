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
import ErrorDialog from '../../components/dailogs/ErrorDialog';

import { COLORS } from '../../constants/colors';
import { LAYOUT } from '../../constants/appConstants';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeInput, setActiveInput] = useState('');

  const handleSend = async () => {
    if (!email) {
      setErrorMessage("Email is empty.");
      setErrorVisible(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email.");
      setErrorVisible(true);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    setErrorMessage("Invalid email address");
    setErrorVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        extraScrollHeight={30}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/svgs/poslogo.png')}
              style={styles.logo}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Please enter your registered email address
          </Text>

          {/* Input */}
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

          {/* Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSend}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>SEND</Text>
            )}
          </TouchableOpacity>

        </View>
      </KeyboardAwareScrollView>

      <ErrorDialog
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </SafeAreaView>
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
  },

  backButton: {
    marginBottom: height * 0.02,
  },

  backText: {
    fontSize: width * 0.04,
    color: COLORS.primary,
    fontWeight: '500',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },

  logo: {
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: 'contain',
  },

  title: {
    fontSize: width * 0.07,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: width * 0.04,
    color: COLORS.greyText,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: height * 0.03,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyText,
    paddingVertical: 10,
    fontSize: width * 0.045,
    marginBottom: height * 0.03,
    color: COLORS.posDark,
  },

  inputFocused: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: LAYOUT.buttonRadius,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
});