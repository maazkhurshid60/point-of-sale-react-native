import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import type { ViewStyle, TextStyle, StyleProp } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';

interface CustomButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'none';
  size?: 'small' | 'medium' | 'large' | 'none';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconComponent?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  iconColor?: string;
  activeOpacity?: number;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  icon,
  iconComponent,
  style,
  textStyle,
  iconSize = 18,
  iconColor,
  activeOpacity = 0.7,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: '#EDF2F7', borderWidth: 0 };
      case 'danger':
        return { backgroundColor: '#F56565', borderWidth: 0 };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary };
      case 'ghost':
        return { backgroundColor: 'transparent', borderWidth: 0 };
      case 'none':
        return {};
      default:
        return { backgroundColor: COLORS.primary, borderWidth: 0 };
    }
  };

  const getTextColor = () => {
    if (disabled) return '#A0AEC0';
    switch (variant) {
      case 'secondary':
        return '#4A5568';
      case 'outline':
        return COLORS.primary;
      case 'ghost':
        return '#4A5568';
      default:
        return 'white';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 15 };
      case 'none':
        return {};
      default:
        return { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 16;
      case 'none':
        return undefined;
      default:
        return 14;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={StyleSheet.flatten([
        styles.base,
        getVariantStyle(),
        getSizeStyle(),
        (disabled || isLoading) && styles.disabled,
        style,
      ])}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {iconComponent ? (
            iconComponent
          ) : icon ? (
            <Ionicons
              name={icon as any}
              size={iconSize}
              color={iconColor || getTextColor()}
              style={title ? styles.icon : {}}
            />
          ) : null}
          {title ? (
            <Text
              style={StyleSheet.flatten([
                styles.text,
                { color: getTextColor(), fontSize: getFontSize() },
                textStyle,
              ])}
            >
              {title}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  text: {
    ...TYPOGRAPHY.montserrat.bold,
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
