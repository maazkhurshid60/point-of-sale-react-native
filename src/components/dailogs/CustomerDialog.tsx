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
} from 'react-native';
import { useCustomers } from '../../api/queries';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { Customer } from '../../models';

interface CustomerDialogProps {
  onSelect?: (customer: Customer) => void;
  onClose: () => void;
}

export default function CustomerDialog({ onSelect, onClose }: CustomerDialogProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const { data: customers, isLoading } = useCustomers();
  const setSelectedCustomer = useCartStore((state) => state.setSelectedCustomer);
  const setScreen = useUIStore((state) => state.setScreen);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.mobile && c.mobile.includes(searchQuery))
    );
  }, [customers, searchQuery]);

  const handleSelect = (customer: Customer) => {
    setSelectedCustomer(customer.name, customer.customer_id);
    if (onSelect) onSelect(customer);
    onClose();
  };

  const handleAddNew = () => {
    console.log('Navigating to CUSTOMERS screen...');
    onClose();
    // Use InteractionManager or a slightly longer timeout to ensure UI is ready
    setTimeout(() => {
      setScreen('CUSTOMERS');
    }, 150);
  };

  return (
    <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 500, maxHeight: height * 0.8 }]}>
      <Text style={styles.title}>Customers</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or mobile..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus
        placeholderTextColor="#9ca3af"
      />

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredCustomers}
            keyExtractor={(item) => item.customer_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.customerItem}
                onPress={() => handleSelect(item)}
              >
                <View>
                  <Text style={styles.customerName}>{item.name}</Text>
                  {item.mobile && <Text style={styles.customerMobile}>{item.mobile}</Text>}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No customers found</Text>
            }
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        )}
      </View>

      <TouchableOpacity style={styles.addNewBtn} onPress={handleAddNew}>
        <Text style={styles.addNewText}>Add New Customer</Text>
      </TouchableOpacity>

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
    color: '#4b5563',
    fontFamily: 'Montserrat',
    marginBottom: 15,
  },
  searchInput: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: 'rgba(196, 196, 196, 0.5)',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: 'Montserrat',
    marginBottom: 15,
    color: '#1f2937',
  },
  listContainer: {
    width: '100%',
    flexGrow: 0,
    minHeight: 200,
    maxHeight: 400,
  },
  customerItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(142, 142, 142, 0.1)',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7b1fa2',
    fontFamily: 'Montserrat',
  },
  customerMobile: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Montserrat',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
    fontFamily: 'Montserrat',
  },
  addNewBtn: {
    marginTop: 20,
    paddingVertical: 10,
  },
  addNewText: {
    color: '#7b1fa2',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    textDecorationLine: 'underline',
  },
  closeBtn: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#7b1fa2',
    borderRadius: 8,
  },
  closeBtnText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  }
});
