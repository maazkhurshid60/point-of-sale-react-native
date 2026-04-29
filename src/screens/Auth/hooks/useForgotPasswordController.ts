import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useForgotPasswordController = () => {
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

  return {
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
  };
};
