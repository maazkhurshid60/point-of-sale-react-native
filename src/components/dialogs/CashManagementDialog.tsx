import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { FontAwesome6 } from '@expo/vector-icons';
import { useUpdateCashManagement } from '../../api/shift/queries';

interface CashManagementDialogProps {
  onClose: () => void;
  onSuccess?: (success: boolean) => void;
}

export default function CashManagementDialog({ onClose, onSuccess }: CashManagementDialogProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  
  const { mutateAsync: updateCashManagement, isPending } = useUpdateCashManagement();

  const [paidIn, setPaidIn] = useState('');
  const [paidOut, setPaidOut] = useState('');
  const [notes, setNotes] = useState('');

  const handleOkay = async () => {
    try {
      const pIn = paidIn ? parseFloat(paidIn) : 0;
      const pOut = paidOut ? parseFloat(paidOut) : 0;

      if ((paidIn && isNaN(pIn)) || (paidOut && isNaN(pOut))) {
        Alert.alert('Error', 'Please enter valid numbers only');
        return;
      }

      await updateCashManagement({ 
        paidIn: pIn.toString(), 
        paidOut: pOut.toString(), 
        notes 
      });
      if (onSuccess) onSuccess(true);
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to update cash management');
    }
  };

  return (
    <View style={[styles.dialogCard, { width: isPortrait ? '92%' : 520 }]}>
      {/* Header */}
      <View style={styles.header}>
        <FontAwesome6 name="money-bill-transfer" size={22} color={COLORS.primary} />
        <Text style={styles.title}>Cash Management</Text>
      </View>

      {/* Paid In / Paid Out */}
      <View style={styles.amountsRow}>
        <View style={styles.amountContainer}>
          <View style={styles.labelRow}>
            <FontAwesome6 name="arrow-down" size={12} color={COLORS.posGreen} />
            <Text style={styles.label}>Paid In</Text>
          </View>
          <TextInput
            style={[styles.amountInput, { borderColor: COLORS.posGreen }]}
            value={paidIn}
            onChangeText={setPaidIn}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="rgba(142, 142, 142, 0.5)"
            textAlign="center"
            maxLength={10}
            editable={!isPending}
          />
        </View>

        <View style={{ width: 16 }} />

        <View style={styles.amountContainer}>
          <View style={styles.labelRow}>
            <FontAwesome6 name="arrow-up" size={12} color={COLORS.posRed} />
            <Text style={styles.label}>Paid Out</Text>
          </View>
          <TextInput
            style={[styles.amountInput, { borderColor: COLORS.posRed }]}
            value={paidOut}
            onChangeText={setPaidOut}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="rgba(142, 142, 142, 0.5)"
            textAlign="center"
            maxLength={10}
            editable={!isPending}
          />
        </View>
      </View>

      {/* Remarks */}
      <Text style={[styles.label, { alignSelf: 'flex-start', marginTop: 16 }]}>Remarks (Optional)</Text>
      <TextInput
        style={styles.remarksInput}
        value={notes}
        onChangeText={setNotes}
        placeholder="Add a note..."
        placeholderTextColor="rgba(142,142,142,0.5)"
        multiline
        numberOfLines={2}
        maxLength={150}
        editable={!isPending}
      />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => onClose()} disabled={isPending}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.okayBtn} onPress={handleOkay} disabled={isPending}>
          {isPending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.okayText}>Confirm</Text>
          )}
        </TouchableOpacity>
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
    marginBottom: 24,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 22,
    color: COLORS.primary,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  amountContainer: {
    flex: 1,
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  label: {
    ...TYPOGRAPHY.montserrat.medium,
    color: '#64748B',
    fontSize: 13,
  },
  amountInput: {
    width: '100%',
    height: 60,
    borderWidth: 1.5,
    borderRadius: 12,
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  remarksInput: {
    width: '100%',
    minHeight: 60,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.primary,
    color: '#1E293B',
    fontSize: 14,
    paddingVertical: 8,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
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
  okayBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelText: {
    ...TYPOGRAPHY.montserrat.medium,
    color: '#64748B',
    fontSize: 15,
  },
  okayText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 15,
  },
});
