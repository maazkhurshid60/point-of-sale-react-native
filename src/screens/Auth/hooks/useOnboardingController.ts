import { useState, useRef } from 'react';
import { FlatList, ViewToken, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../store/useAuthStore';

export const onboardingData = [
  {
    id: '1',
    title: "Track Your Inventory",
    description: "Keep a real-time eye on your stock levels and get notified instantly.",
    image: require('../../../../assets/images/boarding1.png'),
  },
  {
    id: '2',
    title: "Business Insights",
    description: "View detailed reports and analytics to help your business grow.",
    image: require('../../../../assets/images/boarding2.png'),
  },
  {
    id: '3',
    title: "Seamless POS",
    description: "Process transactions quickly and securely with our integrated system.",
    image: require('../../../../assets/images/boarding3.png'),
  },
  {
    id: '4',
    title: "Cloud Sync & Security",
    description: "Your data is always safe and accessible across all your devices.",
    image: require('../../../../assets/images/boarding4.png'),
  },
];

export const useOnboardingController = () => {
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<any>();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);

  const isLastPage = currentIndex === onboardingData.length - 1;

  const handleNext = () => {
    if (isLastPage) {
      completeOnboarding();
      navigation.replace('SignIn');
    } else {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigation.replace('SignIn');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return {
    width,
    height,
    currentIndex,
    flatListRef,
    isLastPage,
    handleNext,
    handleSkip,
    onViewableItemsChanged,
    viewabilityConfig,
  };
};
