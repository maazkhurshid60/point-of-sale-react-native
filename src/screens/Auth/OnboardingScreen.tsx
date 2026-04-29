import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onboardingData, useOnboardingController } from './hooks/useOnboardingController';
import { styles } from './OnboardingScreen.styles';

export const OnboardingScreen = () => {
  const {
    width,
    height,
    currentIndex,
    flatListRef,
    isLastPage,
    handleNext,
    handleSkip,
    onViewableItemsChanged,
    viewabilityConfig,
  } = useOnboardingController();

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
};

export default OnboardingScreen;
