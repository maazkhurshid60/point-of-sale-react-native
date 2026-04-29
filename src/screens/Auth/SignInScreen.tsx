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
import { useSignInController } from './hooks/useSignInController';
import { styles } from './SignInScreen.styles';

export const SignInScreen = () => {
  const {
    windowWidth,
    windowHeight,
    isTabletLandscape,
    navigation,
    clientCode,
    username,
    password,
    isObscure,
    rememberMe,
    isLoading,
    errorVisible,
    errorMessage,
    activeInput,
    setClientCode,
    setUsername,
    setPassword,
    setErrorVisible,
    setActiveInput,
    handleLogin,
    toggleObscure,
    toggleRememberMe,
  } = useSignInController();

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
                        onPress={toggleObscure}
                        style={styles.showHide}
                      >
                        <Text style={styles.showHideText}>
                          {isObscure ? 'Show' : 'Hide'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.rowBetween}>
                    <TouchableOpacity
                      onPress={toggleRememberMe}
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

export default SignInScreen;