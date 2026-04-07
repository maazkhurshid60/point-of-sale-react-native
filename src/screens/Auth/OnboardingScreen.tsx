import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, ViewToken, useWindowDimensions } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigation } from '@react-navigation/native';



const onboardingData = [
  {
    id: '1',
    title: "Track Your Inventory",
    description: "Keep a real-time eye on your stock levels and get notified instantly.",
    image: require('../../../assets/images/boarding1.png'),
  },
  {
    id: '2',
    title: "Business Insights",
    description: "View detailed reports and analytics to help your business grow.",
    image: require('../../../assets/images/boarding2.png'),
  },
  {
    id: '3',
    title: "Seamless POS",
    description: "Process transactions quickly and securely with our integrated system.",
    image: require('../../../assets/images/boarding3.png'),
  },
  {
    id: '4',
    title: "Cloud Sync & Security",
    description: "Your data is always safe and accessible across all your devices.",
    image: require('../../../assets/images/boarding4.png'),
  },
];

export default function OnboardingScreen() {
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
      // Fallback update for web environments where onMomentumScrollEnd/onViewableItemsChanged might be delayed
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

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
    <View style={[styles.page, { width }]}>
      <View style={[styles.imageContainer, { height: height * 0.45 }]}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item: any) => item.id}
        getItemLayout={(_, index: number) => ({
          length: width,
          offset: width * index,
          index,
        })}
        snapToInterval={width}
        snapToAlignment="center"
        decelerationRate="fast"
      />

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => {
            const active = index === currentIndex;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  active ? styles.activeDot : {},
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{isLastPage ? "Get Started" : "Next"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FB',
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 14,
    color: '#757575',
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    marginTop: 36,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1C1B1F',
    textAlign: 'center',
    marginBottom: 18,
  },
  description: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 32,
  },
  indicatorContainer: {
    flexDirection: 'row',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#D1D1D1',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 30,
    backgroundColor: '#7E57C2',
  },
  button: {
    backgroundColor: '#7E57C2',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 14,
    zIndex: 10,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});
