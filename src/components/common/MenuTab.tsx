import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

interface MenuTabProps {
  title: string;
  subtitle?: string;
  icon: any;
  onTap: () => void;
  isSmall?: boolean;
}

export const MenuTab: React.FC<MenuTabProps> = ({ title, subtitle, icon, onTap, isSmall }) => {
  return (
    <Pressable 
      onPress={onTap} 
      style={({ pressed }) => [
        styles.container, 
        isSmall && styles.smallContainer,
        { backgroundColor: pressed ? 'rgba(255, 255, 255, 0.15)' : 'transparent' }
      ]}
    >
      <View style={styles.iconContainer}>
        {typeof icon === 'string' ? (
          <FontAwesome6 name={icon} size={isSmall ? 18 : 22} color="white" />
        ) : (
          icon
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, isSmall && styles.smallTitle]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, isSmall && styles.smallSubtitle]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 12,
  },
  smallContainer: {
    paddingVertical: 10,
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 18,
    color: 'white',
    letterSpacing: 0.3,
  },
  smallTitle: {
    fontSize: 16,
  },
  subtitle: {
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  smallSubtitle: {
    fontSize: 11,
  },
});
