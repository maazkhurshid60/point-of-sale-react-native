// // import React, { useState } from 'react';
// // import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Image, KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// // import { useAuthStore } from '../../store/useAuthStore';
// // import ErrorDialog from '../../components/ErrorDialog';

// // import { COLORS } from '../../constants/colors';
// // import { LAYOUT } from '../../constants/appConstants';
// // import { IMAGE_ASSETS } from '../../constants/imageAssets';
// // import { TYPOGRAPHY } from '../../constants/typography';

// // export default function SignInScreen() {
// //   const navigation = useNavigation();
// //   const [clientCode, setClientCode] = useState('');
// //   const [username, setUsername] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [isObscure, setIsObscure] = useState(true);
// //   const [rememberMe, setRememberMe] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [errorVisible, setErrorVisible] = useState(false);
// //   const [errorMessage, setErrorMessage] = useState('');

// //   // Track focus states strictly for Flutter's "UnderlineInputBorder" behavior
// //   const [activeInput, setActiveInput] = useState('');

// //   const signIn = useAuthStore((state) => state.signIn);

// //   const handleLogin = async () => {
// //     if (!clientCode || !username || !password) return;

// //     setIsLoading(true);
// //     const success = await signIn(clientCode, username, password);
// //     setIsLoading(false);

// //     if (!success) {
// //       setErrorMessage("Invalid Credentials or network issue.");
// //       setErrorVisible(true);
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
// //       <KeyboardAvoidingView
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //         style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
// //       >
// //         <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, width: '100%' }}>

// //           <View style={styles.card}>
// //             {/* Centered Logo mapped exactly */}
// //             <View style={{ alignItems: 'center', marginBottom: 20 }}>
// //               <Image
// //                 source={require('../../../assets/svgs/poslogo.png')}
// //                 style={{ width: 140, height: 140, resizeMode: 'contain' }}
// //               />
// //             </View>

// //             {/* Typography exactly matching Deep Purple 'Sign In' variant */}
// //             <Text style={styles.title}>Sign In</Text>

// //             {/* Form Fields mapped to exact flutter paddings and underlines */}
// //             <View style={{ marginTop: 20 }}>
// //               <TextInput
// //                 style={[
// //                   styles.input,
// //                   activeInput === 'clientCode' ? styles.inputFocused : {}
// //                 ]}
// //                 placeholder="Client Code"
// //                 placeholderTextColor={COLORS.greyText}
// //                 value={clientCode}
// //                 onChangeText={setClientCode}
// //                 autoCapitalize="none"
// //                 keyboardType="numeric"
// //                 onFocus={() => setActiveInput('clientCode')}
// //                 onBlur={() => setActiveInput('')}
// //               />

// //               <TextInput
// //                 style={[
// //                   styles.input,
// //                   activeInput === 'username' ? styles.inputFocused : {}
// //                 ]}
// //                 placeholder="username"
// //                 placeholderTextColor={COLORS.greyText}
// //                 value={username}
// //                 onChangeText={setUsername}
// //                 autoCapitalize="none"
// //                 onFocus={() => setActiveInput('username')}
// //                 onBlur={() => setActiveInput('')}
// //               />

// //               <View style={{ position: 'relative', justifyContent: 'center' }}>
// //                 <TextInput
// //                   style={[
// //                     styles.input,
// //                     activeInput === 'password' ? styles.inputFocused : {},
// //                     { paddingRight: 40 }
// //                   ]}
// //                   placeholder="password"
// //                   placeholderTextColor={COLORS.greyText}
// //                   value={password}
// //                   onChangeText={setPassword}
// //                   secureTextEntry={!!isObscure}
// //                   onFocus={() => setActiveInput('password')}
// //                   onBlur={() => setActiveInput('')}
// //                 />
// //                 <TouchableOpacity
// //                   onPress={() => setIsObscure(!isObscure)}
// //                   style={{ position: 'absolute', right: 0, top: 12 }}
// //                 >
// //                   <Text style={{ color: '#A0A0A0', fontSize: 14 }}>{isObscure ? "Show" : "Hide"}</Text>
// //                 </TouchableOpacity>
// //               </View>

// //               {/* Remember Me & Forgot Password Block */}
// //               <View style={styles.rowBetween}>
// //                 <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={{ flexDirection: 'row', alignItems: 'center' }}>
// //                   <View style={[styles.checkbox, rememberMe ? { backgroundColor: COLORS.primary, borderColor: COLORS.primary } : {}]} />
// //                   <Text style={{ color: COLORS.greyText, fontSize: 16, marginLeft: 10, fontWeight: '300' }}>remember me</Text>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword" as never)}>
// //                   <Text style={{ color: COLORS.primary, fontWeight: '500', fontSize: 16 }}>forgot password?</Text>
// //                 </TouchableOpacity>
// //               </View>

// //               {/* Submit Button matched via horizontal padding 115w scale */}
// //               <View style={{ alignItems: 'center' }}>
// //                 <TouchableOpacity
// //                   style={styles.button}
// //                   onPress={handleLogin}
// //                   disabled={!!isLoading}
// //                 >
// //                   {isLoading ? (
// //                     <ActivityIndicator color="white" size="small" />
// //                   ) : (
// //                     <Text style={styles.buttonText}>SIGN IN</Text>
// //                   )}
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           </View>

// //         </ScrollView>
// //       </KeyboardAvoidingView>
// //       <ErrorDialog
// //         visible={errorVisible}
// //         errorMessage={errorMessage}
// //         onClose={() => setErrorVisible(false)}
// //       />
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   card: {
// //     backgroundColor: COLORS.white,
// //     borderRadius: LAYOUT.cardRadius,
// //     paddingHorizontal: 40,
// //     paddingVertical: 35,
// //     width: '100%',
// //     maxWidth: 500, // Keeps it strictly square on larger screens recreating the Portrait Container
// //     shadowColor: COLORS.black,
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.5,
// //     shadowRadius: 5.0,
// //     elevation: 8,
// //   },
// //   title: {
// //     fontSize: 34,
// //     fontWeight: '600',
// //     color: COLORS.primary,
// //     textAlign: 'center',
// //     marginBottom: 5,
// //   },
// //   input: {
// //     borderBottomWidth: 1,
// //     borderBottomColor: COLORS.greyText, // Explicitly recreate Flutter UnderlineInputBorder
// //     paddingVertical: 12,
// //     fontSize: 18,
// //     color: COLORS.posDark,
// //     marginBottom: 25,
// //   },
// //   inputFocused: {
// //     borderBottomWidth: 2,
// //     borderBottomColor: COLORS.primary, // Active focus line
// //   },
// //   rowBetween: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 40,
// //   },
// //   checkbox: {
// //     width: 20,
// //     height: 20,
// //     borderWidth: 2,
// //     borderColor: '#A0A0A0',
// //     borderRadius: 2,
// //   },
// //   button: {
// //     backgroundColor: COLORS.primary,
// //     paddingVertical: 14,
// //     paddingHorizontal: 60, // Squeezes horizontally mapped to the 115.w configuration
// //     borderRadius: LAYOUT.buttonRadius,
// //     minWidth: '80%', // Takes up proper amount within absolute Center
// //     alignItems: 'center',
// //     shadowColor: COLORS.black,
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 2,
// //     elevation: 3,
// //   },
// //   buttonText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     letterSpacing: 0.5,
// //   }
// // });



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   ScrollView,
//   Dimensions
// } from 'react-native';

// import { useNavigation } from '@react-navigation/native';
// import { useAuthStore } from '../../store/useAuthStore';
// import ErrorDialog from '../../components/ErrorDialog';

// import { COLORS } from '../../constants/colors';
// import { LAYOUT } from '../../constants/appConstants';

// const { width, height } = Dimensions.get('window');

// export default function SignInScreen() {
//   const navigation = useNavigation();

//   const [clientCode, setClientCode] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isObscure, setIsObscure] = useState(true);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorVisible, setErrorVisible] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [activeInput, setActiveInput] = useState('');

//   const signIn = useAuthStore((state) => state.signIn);

//   const handleLogin = async () => {
//     if (!clientCode || !username || !password) return;

//     setIsLoading(true);
//     const success = await signIn(clientCode, username, password);
//     setIsLoading(false);

//     if (!success) {
//       setErrorMessage("Invalid Credentials or network issue.");
//       setErrorVisible(true);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContainer}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.card}>

//             {/* Logo */}
//             <View style={styles.logoContainer}>
//               <Image
//                 source={require('../../../assets/svgs/poslogo.png')}
//                 style={styles.logo}
//               />
//             </View>

//             {/* Title */}
//             <Text style={styles.title}>Sign In</Text>

//             {/* Inputs */}
//             <View style={{ marginTop: height * 0.02 }}>

//               <TextInput
//                 style={[
//                   styles.input,
//                   activeInput === 'clientCode' && styles.inputFocused
//                 ]}
//                 placeholder="Client Code"
//                 placeholderTextColor={COLORS.greyText}
//                 value={clientCode}
//                 onChangeText={setClientCode}
//                 keyboardType="numeric"
//                 onFocus={() => setActiveInput('clientCode')}
//                 onBlur={() => setActiveInput('')}
//               />

//               <TextInput
//                 style={[
//                   styles.input,
//                   activeInput === 'username' && styles.inputFocused
//                 ]}
//                 placeholder="Username"
//                 placeholderTextColor={COLORS.greyText}
//                 value={username}
//                 onChangeText={setUsername}
//                 onFocus={() => setActiveInput('username')}
//                 onBlur={() => setActiveInput('')}
//               />

//               {/* Password */}
//               <View style={{ position: 'relative' }}>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     activeInput === 'password' && styles.inputFocused,
//                     { paddingRight: 50 }
//                   ]}
//                   placeholder="Password"
//                   placeholderTextColor={COLORS.greyText}
//                   value={password}
//                   onChangeText={setPassword}
//                   secureTextEntry={isObscure}
//                   onFocus={() => setActiveInput('password')}
//                   onBlur={() => setActiveInput('')}
//                 />

//                 <TouchableOpacity
//                   onPress={() => setIsObscure(!isObscure)}
//                   style={styles.showHide}
//                 >
//                   <Text style={styles.showHideText}>
//                     {isObscure ? 'Show' : 'Hide'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Remember + Forgot */}
//               <View style={styles.rowBetween}>
//                 <TouchableOpacity
//                   onPress={() => setRememberMe(!rememberMe)}
//                   style={styles.rememberContainer}
//                 >
//                   <View style={[
//                     styles.checkbox,
//                     rememberMe && styles.checkboxActive
//                   ]} />
//                   <Text style={styles.rememberText}>Remember me</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() => navigation.navigate("ForgotPassword" as never)}
//                 >
//                   <Text style={styles.forgotText}>Forgot password?</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Button */}
//               <TouchableOpacity
//                 style={styles.button}
//                 onPress={handleLogin}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text style={styles.buttonText}>SIGN IN</Text>
//                 )}
//               </TouchableOpacity>

//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       <ErrorDialog
//         visible={errorVisible}
//         errorMessage={errorMessage}
//         onClose={() => setErrorVisible(false)}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//   },

//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: width * 0.05,
//   },

//   card: {
//     backgroundColor: COLORS.white,
//     borderRadius: LAYOUT.cardRadius,
//     paddingHorizontal: width * 0.06,
//     paddingVertical: height * 0.04,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 5,
//     elevation: 6,
//   },

//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: height * 0.02,
//   },

//   logo: {
//     width: width * 0.3,
//     height: width * 0.3,
//     resizeMode: 'contain',
//   },

//   title: {
//     fontSize: width * 0.07,
//     fontWeight: '600',
//     color: COLORS.primary,
//     textAlign: 'center',
//   },

//   input: {
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.greyText,
//     paddingVertical: 10,
//     fontSize: width * 0.045,
//     marginBottom: height * 0.025,
//     color: COLORS.posDark,
//   },

//   inputFocused: {
//     borderBottomWidth: 2,
//     borderBottomColor: COLORS.primary,
//   },

//   showHide: {
//     position: 'absolute',
//     right: 0,
//     top: 12,
//   },

//   showHideText: {
//     color: '#A0A0A0',
//     fontSize: width * 0.035,
//   },

//   rowBetween: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: height * 0.04,
//   },

//   rememberContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   rememberText: {
//     color: COLORS.greyText,
//     fontSize: width * 0.04,
//     marginLeft: 8,
//   },

//   forgotText: {
//     color: COLORS.primary,
//     fontWeight: '500',
//     fontSize: width * 0.04,
//   },

//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 2,
//     borderColor: '#A0A0A0',
//     borderRadius: 3,
//   },

//   checkboxActive: {
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },

//   button: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 14,
//     borderRadius: LAYOUT.buttonRadius,
//     alignItems: 'center',
//   },

//   buttonText: {
//     color: '#fff',
//     fontSize: width * 0.045,
//     fontWeight: '600',
//     letterSpacing: 0.5,
//   },
// });




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

export default function SignInScreen() {
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
    const success = await signIn(clientCode, username, password);
    setIsLoading(false);

    if (!success) {
      setErrorMessage("Invalid Credentials or network issue.");
      setErrorVisible(true);
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

          {/* Inputs */}
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
              returnKeyType="next"
              onFocus={() => setActiveInput('username')}
              onBlur={() => setActiveInput('')}
            />

            {/* Password */}
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

  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyText,
    paddingVertical: 10,
    fontSize: width * 0.045,
    marginBottom: height * 0.025,
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
    fontSize: width * 0.035,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.04,
  },

  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rememberText: {
    color: COLORS.greyText,
    fontSize: width * 0.04,
    marginLeft: 8,
  },

  forgotText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: width * 0.04,
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