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
import { FontAwesome6 } from '@expo/vector-icons';
import { useCartStore } from '../../store/useCartStore';
import { useDialogStore } from '../../store/useDialogStore';
import { COLORS } from '../../constants/colors';

interface AddProductByDialogProps {
  onClose: () => void;
}

export default function AddProductByDialog({ onClose }: AddProductByDialogProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const [activeTab, setActiveTab] = useState<'SKU' | 'UPC' | 'ID'>('SKU');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addProductByUPCIDBarcode = useCartStore((state) => state.addProductByUPCIDBarcode);
  const showDialog = useDialogStore((state) => state.showDialog);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      await addProductByUPCIDBarcode(query.trim());
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSalesman = () => {
    showDialog('SALESMAN_SELECTION', {});
  };

  return (
    <View style={[styles.dialogCard, { width: isPortrait ? '90%' : 500 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Product By</Text>
        <TouchableOpacity style={styles.salesmanBtn} onPress={handleOpenSalesman}>
          <FontAwesome6 name="user-tie" size={16} color="white" />
          <Text style={styles.salesmanBtnText}>Change Salesman</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabsRow}>
          <TouchableOpacity onPress={() => { setActiveTab('SKU'); setQuery(''); }} activeOpacity={0.7}>
            <Text style={[styles.tabText, activeTab === 'SKU' && styles.tabTextActive]}>SKU</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setActiveTab('UPC'); setQuery(''); }} activeOpacity={0.7}>
            <Text style={[styles.tabText, activeTab === 'UPC' && styles.tabTextActive]}>UPC</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setActiveTab('ID'); setQuery(''); }} activeOpacity={0.7}>
            <Text style={[styles.tabText, activeTab === 'ID' && styles.tabTextActive]}>ID</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabIndicatorBackground}>
          <View
            style={[
              styles.tabIndicator,
              activeTab === 'SKU' && { left: 0 },
              activeTab === 'UPC' && { alignSelf: 'center' },
              activeTab === 'ID' && { right: 0, left: undefined },
            ]}
          />
        </View>
      </View>

      <View style={styles.contentArea}>
        {activeTab === 'ID' ? (
          <Text style={styles.inProgressText}>In Progress</Text>
        ) : (
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder={`enter ${activeTab}`}
            placeholderTextColor="rgba(142, 142, 142, 0.5)"
            textAlign="center"
            autoFocus
            onSubmitEditing={handleSubmit}
            editable={!isLoading}
          />
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.cancelBtn} 
          onPress={onClose} 
          disabled={isLoading}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        
        {activeTab !== 'ID' && (
          <TouchableOpacity 
            style={styles.okayBtn} 
            onPress={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.okayText}>Okay</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4b5563',
    fontFamily: 'Montserrat',
  },
  salesmanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7b1fa2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  salesmanBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  tabContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  tabText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  tabTextActive: {
    color: '#7b1fa2',
  },
  tabIndicatorBackground: {
    height: 2,
    backgroundColor: 'rgba(217, 217, 217, 1)',
    width: '100%',
    position: 'relative',
  },
  tabIndicator: {
    height: 2,
    backgroundColor: '#7b1fa2',
    width: '33%',
    position: 'absolute',
  },
  contentArea: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  inProgressText: {
    color: '#7b1fa2',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 196, 196, 1)',
    width: '100%',
    fontSize: 24,
    fontWeight: '700',
    color: '#7b1fa2',
    paddingVertical: 10,
    fontFamily: 'Montserrat',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: '#7b1fa2',
    borderRadius: 6,
  },
  cancelText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  okayBtn: {
    backgroundColor: '#7b1fa2',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okayText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
});
