import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSalesman } from '../../api/shift/queries';
import { useShiftStore } from '../../store/useShiftStore';
import { COLORS } from '../../constants/colors';
import { Salesman } from '../../models';

interface SalesmanDialogProps {
  onSelect?: (salesman: Salesman) => void;
  onClose: () => void;
}

export default function SalesmanDialog({ onSelect, onClose }: SalesmanDialogProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const { data: salesmen, isLoading } = useSalesman();
  const currentShift = useShiftStore((state) => state.currentShift);
  const selectedSalesman = useShiftStore((state) => state.selectedSalesman);
  const updateSalesmanStore = useShiftStore((state) => state.updateSalesman);

  const [searchQuery, setSearchQuery] = useState('');

  // Sync selected salesman from shift id if not already set
  React.useEffect(() => {
    if (salesmen && currentShift?.salesman_id && !selectedSalesman) {
      const found = salesmen.find(s => s.user_id === currentShift.salesman_id);
      if (found) {
        useShiftStore.setState({ selectedSalesman: found });
      }
    }
  }, [salesmen, currentShift, selectedSalesman]);

  const filteredSalesmen = useMemo(() => {
    if (!salesmen) return [];
    return salesmen.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [salesmen, searchQuery]);

  const handleSelect = async (salesman: Salesman) => {
    try {
      const success = await updateSalesmanStore(salesman.name, salesman.user_id);
      if (success) {
        if (onSelect) onSelect(salesman);
        onClose();
      } else {
        Alert.alert('Error', 'Failed to update salesman on server. Check shift status.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.toString());
    }
  };

  return (
    <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 500, maxHeight: height * 0.9 }]}>
      <Text style={styles.title}>Salesman</Text>

      {/* Current Selected Salesman - Flutter Parity */}
      <View style={styles.currentSection}>
        {(selectedSalesman || currentShift?.salesman_name) ? (
          <>
            <View style={styles.imagePlaceholder}>
              <FontAwesome6 name="user-tie" size={40} color="#e5e7eb" />
            </View>
            <Text style={styles.currentName}>{selectedSalesman?.name || currentShift?.salesman_name}</Text>
            <Text style={styles.currentId}>ID # {selectedSalesman?.user_id || currentShift?.salesman_id}</Text>
          </>
        ) : (
          <Text style={styles.noSelection}>No Seller Selected</Text>
        )}
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search salesman..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#9ca3af"
      />

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredSalesmen}
            keyExtractor={(item) => item.user_id.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedSalesman?.user_id === item.user_id;
              return (
                <TouchableOpacity
                  style={styles.salesmanItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.salesmanName, isSelected && { color: COLORS.primary }]}>
                    {item.name}
                  </Text>
                  {isSelected && (
                    <FontAwesome6 name="check" size={14} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No salesmen found</Text>
            }
          />
        )}
      </View>

      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeBtnText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'Montserrat',
    marginBottom: 20,
  },
  currentSection: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  currentName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  currentId: {
    fontSize: 14,
    color: COLORS.primary,
    opacity: 0.8,
    fontFamily: 'Montserrat',
  },
  noSelection: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    fontFamily: 'Montserrat',
  },
  searchInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Montserrat',
    marginBottom: 15,
    color: '#1f2937',
  },
  listContainer: {
    width: '100%',
    flexGrow: 0,
    minHeight: 150,
    maxHeight: 300,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginTop: 10,
  },
  salesmanItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salesmanName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Montserrat',
  },
  selectedCheck: {
    color: COLORS.primary,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280',
    fontFamily: 'Montserrat',
  },
  closeBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  closeBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Montserrat',
  }
});
