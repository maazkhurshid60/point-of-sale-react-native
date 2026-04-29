import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { TYPOGRAPHY } from '../../constants/typography';
import { CustomButton } from './CustomButton';

interface ActionModalProps {
  visible: boolean;
  type: 'success' | 'error' | 'confirm' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'Continue',
  cancelText = 'Cancel',
}) => {
  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle' as const, color: '#48BB78' };
      case 'error':
        return { name: 'alert-circle' as const, color: '#F56565' };
      case 'confirm':
        return { name: 'trash-outline' as const, color: '#F56565' };
      default:
        return { name: 'information-circle' as const, color: '#4299E1' };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={FadeInLeft.duration(300)}
          style={styles.statusModalContent}
        >
          <View style={[styles.iconCircLarge, { backgroundColor: iconConfig.color }]}>
            <Ionicons name={iconConfig.name} size={40} color="white" />
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>

          {type === 'confirm' ? (
            <View style={styles.modalActionRow}>
              <CustomButton
                title={cancelText}
                onPress={onClose}
                variant="secondary"
                style={styles.modalBtnHalf}
              />
              <CustomButton
                title={confirmText}
                onPress={onConfirm || onClose}
                variant="danger"
                style={styles.modalBtnHalf}
              />
            </View>
          ) : (
            <CustomButton
              title={confirmText}
              onPress={onClose}
              variant={type === 'error' ? 'danger' : 'primary'}
              style={{ width: '100%' }}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusModalContent: {
    width: 320,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  iconCircLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 20,
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMessage: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtnHalf: {
    flex: 1,
  },
});

