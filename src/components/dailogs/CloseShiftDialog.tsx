import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { FontAwesome6 } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';

interface CloseShiftDialogProps {
  onConfirm?: (amount: number) => void;
  onClose: () => void;
}

export default function CloseShiftDialog({ onConfirm, onClose }: CloseShiftDialogProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const closeShift = useAuthStore((state) => state.closeShift);
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOkay = async () => {
    try {
      setIsSubmitting(true);
      const success = await closeShift(parseFloat(amount) || 0);
      setIsSubmitting(false);

      if (success) {
        // Clear all shift data from cache
        await queryClient.invalidateQueries({ queryKey: ['shiftDetails'] });
        await queryClient.invalidateQueries({ queryKey: ['shift'] });

        useUIStore.getState().setScreen('DEFAULT');
        if (onConfirm) onConfirm(parseFloat(amount) || 0);
        onClose();
      } else {
        alert('Failed to close shift. Please check your connection.');
      }
    } catch (e: any) {
      setIsSubmitting(false);
      alert(e.toString());
    }
  };

  return (
    <View style={[styles.dialogCard, { width: isPortrait ? '88%' : 460 }]}>
      {/* Header */}
      <View style={styles.header}>
        <FontAwesome6 name="power-off" size={22} color={COLORS.posRed} />
        <Text style={styles.title}>Close Shift</Text>
      </View>

      <Text style={styles.subtitle}>Enter the closing cash amount to finalize the shift.</Text>

      {/* Amount Input */}
      <Text style={styles.label}>Closing Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        placeholderTextColor="rgba(142, 142, 142, 0.5)"
        keyboardType="numeric"
        style={styles.input}
        autoFocus
        maxLength={10}
        textAlign="center"
        onSubmitEditing={handleOkay}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isSubmitting}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        {isSubmitting ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginLeft: 20 }} />
        ) : (
          <TouchableOpacity style={styles.okBtn} onPress={handleOkay}>
            <Text style={styles.okText}>Close Shift</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 22,
    color: COLORS.posRed,
  },
  subtitle: {
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: '#64748B',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 64,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    alignItems: 'center',
  },
  okBtn: {
    flex: 1,
    paddingVertical: 13,
    backgroundColor: COLORS.posRed,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    ...TYPOGRAPHY.montserrat.medium,
    color: '#64748B',
    fontSize: 15,
  },
  okText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 15,
  },
});
