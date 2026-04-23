import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconSize?: number;
  iconColor?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  iconSize = 18,
  iconColor,
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
      default:
        return 14;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.base,
        getVariantStyle(),
        getSizeStyle(),
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon as any}
              size={iconSize}
              color={iconColor || getTextColor()}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: getFontSize() },
              textStyle,
            ]}
          >
            {title}
          </Text>
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
