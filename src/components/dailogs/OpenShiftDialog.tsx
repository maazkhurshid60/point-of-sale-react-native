import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useStores, usePOSIDs } from '../../api/queries';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { FontAwesome6 } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';

interface OpenShiftDialogProps {
  onOpen?: (amount: number) => void;
  onClose: () => void;
}

export default function OpenShiftDialog({ onOpen, onClose }: OpenShiftDialogProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const openShift = useAuthStore((state) => state.openShift);
  const setScreen = useUIStore((state) => state.setScreen);
  const queryClient = useQueryClient();
  const { data: stores, isLoading: loadingStores } = useStores();
  const { data: posIds, isLoading: loadingPos } = usePOSIDs();

  const [amount, setAmount] = useState('');
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [selectedPos, setSelectedPos] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (stores && stores.length > 0 && !selectedStore) {
      setSelectedStore((stores[0] as any).store_id);
    }
  }, [stores]);

  useEffect(() => {
    if (posIds && posIds.length > 0 && !selectedPos) {
      setSelectedPos((posIds[0] as any).fbr_pos_id || (posIds[0] as any).id);
    }
  }, [posIds]);

  const handleOkay = async () => {
    if (!selectedStore || !selectedPos) {
      alert('Please select a store and POS ID');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await openShift(selectedStore, parseFloat(amount) || 0, selectedPos);
      setIsSubmitting(false);

      if (success) {
        // Hard refresh all shift related queries
        await queryClient.invalidateQueries({ queryKey: ['shiftDetails'] });
        await queryClient.invalidateQueries({ queryKey: ['shift'] });
        await queryClient.refetchQueries({ queryKey: ['shiftDetails'] });

        if (onOpen) onOpen(parseFloat(amount) || 0);
        setScreen('POS_BILLING');
        onClose();
      } else {
        alert('Failed to open shift. Please check your connection.');
      }
    } catch (e: any) {
      setIsSubmitting(false);
      alert(e.toString());
    }
  };

  const currentStoreName = (stores as any[])?.find(s => s.store_id === selectedStore)?.store_name || "Select Store";
  const currentPosName = (posIds as any[])?.find(p => (p.fbr_pos_id || p.id) === selectedPos)?.name || "Select POS";

  return (
    <View style={[styles.dialogCard, { width: isPortrait ? '92%' : 520 }]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <FontAwesome6 name="user-check" size={22} color={COLORS.primary} />
          <Text style={styles.title}>Open Shift</Text>
        </View>

        {/* Amount */}
        <Text style={styles.label}>Enter Current Cash Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor="rgba(142,142,142,0.6)"
          keyboardType="numeric"
          style={styles.input}
          textAlign="center"
        />

        {/* Stores Selection */}
        <Text style={styles.label}>Select Store</Text>
        <View style={styles.selectionList}>
          {loadingStores ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            (stores as any[])?.map((item) => (
              <TouchableOpacity
                key={item.store_id}
                onPress={() => setSelectedStore(item.store_id)}
                style={[styles.selectionItem, selectedStore === item.store_id && styles.activeItem]}
              >
                <FontAwesome6
                  name={selectedStore === item.store_id ? "circle-dot" : "circle"}
                  size={14}
                  color={selectedStore === item.store_id ? COLORS.primary : "#94A3B8"}
                />
                <Text style={[styles.itemText, selectedStore === item.store_id && styles.activeItemText]}>
                  {item.store_name || item.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* POS IDs Selection */}
        <Text style={styles.label}>Select POS ID</Text>
        <View style={styles.selectionList}>
          {loadingPos ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            (posIds as any[])?.map((item) => {
              const id = item.fbr_pos_id || item.id;
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => setSelectedPos(id)}
                  style={[styles.selectionItem, selectedPos === id && styles.activeItem]}
                >
                  <FontAwesome6
                    name={selectedPos === id ? "circle-dot" : "circle"}
                    size={14}
                    color={selectedPos === id ? COLORS.primary : "#94A3B8"}
                  />
                  <Text style={[styles.itemText, selectedPos === id && styles.activeItemText]}>
                    {item.name} (ID: {id})
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Actions */}
        <View style={styles.buttonRow}>
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.primary} size="large" />
          ) : (
            <TouchableOpacity style={styles.okBtn} onPress={handleOkay}>
              <Text style={styles.okText}>Okay</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dashboard Back Button */}
        <TouchableOpacity
          style={styles.dashboardBtn}
          onPress={() => {
            setScreen('DEFAULT');
            onClose();
          }}
        >
          <FontAwesome6 name="chevron-left" size={14} color={COLORS.primary} />
          <Text style={styles.dashboardBtnText}>Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
    color: COLORS.primary,
  },
  label: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 14,
    color: COLORS.textDark,
    alignSelf: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    width: '100%',
    maxWidth: 200,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
  },
  selectionList: {
    width: '100%',
    gap: 8,
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
    gap: 10,
  },
  activeItem: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(106, 27, 154, 0.05)',
  },
  itemText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: '#64748B',
  },
  activeItemText: {
    color: COLORS.primary,
    ...TYPOGRAPHY.montserrat.bold,
  },
  buttonRow: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  okBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  okText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    padding: 8,
    gap: 8,
  },
  dashboardBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: COLORS.primary,
    fontSize: 15,
  },
});
