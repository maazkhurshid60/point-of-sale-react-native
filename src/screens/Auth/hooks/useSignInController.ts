import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../store/useAuthStore';

export const useSignInController = () => {
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

  const toggleObscure = () => setIsObscure(!isObscure);
  const toggleRememberMe = () => setRememberMe(!rememberMe);

  return {
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
  };
};
