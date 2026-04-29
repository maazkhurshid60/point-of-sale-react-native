import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInLeft, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../screens/Restaurant/RestaurantTableScreen.styles';

interface ControlCardProps {
  title: string;
  children: React.ReactNode;
  icon: string;
}

export const ControlCard: React.FC<ControlCardProps> = ({ title, children, icon }) => (
  <Animated.View
    entering={FadeInLeft.duration(300)}
    layout={Layout.springify()}
    style={styles.properCard}
  >
    <View style={styles.properCardHeader}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon as any} size={16} color="white" />
      </View>
      <Text style={styles.properCardTitle}>{title}</Text>
    </View>
    <View style={styles.properCardContent}>
      {children}
    </View>
  </Animated.View>
);
