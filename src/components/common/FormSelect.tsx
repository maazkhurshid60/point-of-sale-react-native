import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';

interface FormSelectProps {
  label: string;
  value?: string;
  placeholder?: string;
  onPress: () => void;
  style?: ViewStyle;
  icon?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  placeholder = 'Select...',
  onPress,
  style,
  icon,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.selectBtn}
        onPress={onPress}
      >
        <View style={styles.leftContent}>
          {icon && (
            <Ionicons
              name={icon as any}
              size={16}
              color={COLORS.primary}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.value,
              !value && styles.placeholder,
            ]}
            numberOfLines={1}
          >
            {value || placeholder}
          </Text>
        </View>
        <FontAwesome6 name="chevron-down" size={12} color={COLORS.greyText} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#718096',
    marginBottom: 6,
  },
  selectBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  value: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 14,
    color: '#2D3748',
  },
  placeholder: {
    color: '#A0AEC0',
    fontWeight: '400',
  },
  icon: {
    marginRight: 10,
  },
});
