import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { FontAwesome6 } from '@expo/vector-icons';

export interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  selectedValue: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconColor?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select...',
  style,
  textStyle,
  iconColor = COLORS.primary,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdownButton, style]}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.buttonText, !selectedOption && styles.placeholderText, textStyle]} numberOfLines={1}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <FontAwesome6 name="chevron-down" size={12} color={iconColor} style={styles.icon} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{placeholder}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <FontAwesome6 name="xmark" size={16} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={options}
                keyExtractor={(item, index) => `${item.value}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      item.value === selectedValue && styles.selectedOption,
                    ]}
                    onPress={() => {
                      onValueChange(item.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        item.value === selectedValue && styles.selectedOptionText,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.value === selectedValue && (
                      <FontAwesome6 name="check" size={14} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 52,
  },
  buttonText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
    marginRight: 10,
  },
  placeholderText: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  icon: {
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    maxHeight: '70%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  listContent: {
    padding: 10,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
  },
  selectedOption: {
    backgroundColor: '#EEF2FF',
  },
  optionText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 15,
    color: '#334155',
  },
  selectedOptionText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: COLORS.primary,
  },
});
