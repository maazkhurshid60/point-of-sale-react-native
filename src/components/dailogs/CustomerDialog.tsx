import React, { useState, useMemo, useEffect } from 'react';
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
import { useAuthStore } from '../../store/useAuthStore';
interface CustomerDialogProps {
  onSelect?: (customer: Customer) => void;
  onClose: () => void;
}

export default function CustomerDialog({ onSelect, onClose }: CustomerDialogProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const { data: initialCustomers, isLoading: initialLoading } = useCustomers();
  const searchCustomers = useAuthStore((state) => state.searchCustomers);
  const setSelectedCustomer = useCartStore((state) => state.setSelectedCustomer);
  const setScreen = useUIStore((state) => state.setScreen);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initial load sync
  useEffect(() => {
    if (initialCustomers) {
      setSearchResults(initialCustomers);
    }
  }, [initialCustomers]);

  // Debounced server search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        const results = await searchCustomers(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else if (initialCustomers) {
        setSearchResults(initialCustomers);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchCustomers, initialCustomers]);

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
        {initialLoading || isSearching ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => item.customer_id?.toString() || index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.customerItem}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.customerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.customerName}>{item.name}</Text>
                    {item.company_name && <Text style={styles.customerCompany}>{item.company_name}</Text>}
                    {item.mobile && <Text style={styles.customerMobile}>{item.mobile}</Text>}
                  </View>
                  {item.balance && (
                    <View style={styles.balanceContainer}>
                      <Text style={styles.balanceText}>{item.balance}</Text>
                    </View>
                  )}
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
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Montserrat',
  },
  customerCompany: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Montserrat',
    marginTop: 1,
  },
  customerMobile: {
    fontSize: 12,
    color: '#4b5563',
    fontFamily: 'Montserrat',
    marginTop: 2,
    fontWeight: '500',
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  balanceText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'Montserrat',
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
