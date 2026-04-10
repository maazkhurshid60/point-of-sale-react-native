import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';

interface StatusCardProps {
  label: string;
  value: string;
  icon: string;
  color?: string;
}

const ReportStatusCard: React.FC<StatusCardProps> = ({ label, value, icon, color = COLORS.primary }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <FontAwesome6 name={icon} size={16} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: COLORS.black }]}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#f1f3f5',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: COLORS.greyText,
    marginBottom: 2,
  },
  value: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
  },
});

export default ReportStatusCard;
