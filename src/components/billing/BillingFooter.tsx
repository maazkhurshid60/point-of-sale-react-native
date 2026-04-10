import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { LAYOUT } from '../../constants/appConstants';
import { useCartStore } from '../../store/useCartStore';
import { useDialogStore } from '../../store/useDialogStore';

const { width } = Dimensions.get('window');

export const BillingFooter = () => {
  const subtotal = useCartStore((state) => state.subtotal);
  const taxAmount = useCartStore((state) => state.taxAmount);
  const discountAmount = useCartStore((state) => state.discountAmount);
  const totalToPay = useCartStore((state) => state.totalToPay);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItems = useCartStore((state) => state.cartItems);
  const holdCurrentSale = useCartStore((state) => state.holdCurrentSale);
  const makePrintBillSale = useCartStore((state) => state.makePrintBillSale);
  const showDialog = useDialogStore((state) => state.showDialog);

  const handlePay = () => {
    if ((cartItems?.length || 0) === 0) return;
    console.log("PAY clicked");
  };

  const handleHold = async () => {
    if ((cartItems?.length || 0) === 0) return;
    const success = await holdCurrentSale();
    if (success) {
      Alert.alert("Success", "Sale has been held successfully.");
    } else {
      Alert.alert("Error", "Failed to hold sale. Please try again.");
    }
  };

  const handleTicket = async () => {
    if ((cartItems?.length || 0) === 0) return;
    const data = await makePrintBillSale();
    if (data) {
      showDialog('RAW_BILL_SLIP', { slipData: data });
    } else {
      Alert.alert("Error", "Failed to generate ticket. Please try again.");
    }
  };

  const isCartEmpty = (cartItems?.length || 0) === 0;

  return (
    <View style={styles.container}>
      {/* Totals Section */}
      <View style={styles.totalsContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>{subtotal?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tax</Text>
          <Text style={styles.value}>+ {taxAmount?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Discount</Text>
          <Text style={[styles.value, { color: '#ef4444' }]}>- {discountAmount?.toFixed(2) || '0.00'}</Text>
        </View>

        <View style={[styles.row, styles.grandTotalRow]}>
          <Text style={styles.grandLabel}>TOTAL</Text>
          <Text style={styles.grandValue}>{totalToPay?.toFixed(2) || '0.00'}</Text>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.clearButton,
            { opacity: isCartEmpty ? 0.4 : (pressed ? 0.7 : 1) }
          ]}
          onPress={clearCart}
          disabled={isCartEmpty}
        >
          <FontAwesome6 name="rotate-left" size={16} color="#fff" />
          <Text style={styles.buttonText}>CLEAR</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.holdButton,
            { opacity: isCartEmpty ? 0.4 : (pressed ? 0.7 : 1) }
          ]}
          onPress={handleHold}
          disabled={isCartEmpty}
        >
          <FontAwesome6 name="pause" size={16} color="#fff" />
          <Text style={styles.buttonText}>HOLD</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.ticketButton,
            { opacity: isCartEmpty ? 0.4 : (pressed ? 0.7 : 1) }
          ]}
          onPress={handleTicket}
          disabled={isCartEmpty}
        >
          <FontAwesome6 name="ticket" size={16} color="#fff" />
          <Text style={styles.buttonText}>TICKET</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.payButton,
            { opacity: isCartEmpty ? 0.4 : (pressed ? 0.7 : 1) }
          ]}
          onPress={handlePay}
          disabled={isCartEmpty}
        >
          <FontAwesome6 name="wallet" size={18} color="#fff" />
          <Text style={[styles.buttonText, styles.payButtonText]}>PAY NOW</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    padding: 16,
    zIndex: 10,
  },
  totalsContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: COLORS.greyText,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#1C1B1F',
    fontWeight: '600',
  },
  grandTotalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  grandLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1B1F',
  },
  grandValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 54,
    borderRadius: LAYOUT.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  clearButton: {
    backgroundColor: '#9ca3af',
  },
  holdButton: {
    backgroundColor: '#6366f1',
  },
  ticketButton: {
    backgroundColor: '#fbbf24', // Amber/Yellow for ticket
  },
  payButton: {
    backgroundColor: COLORS.primary,
    flex: 1.3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  payButtonText: {
    fontSize: 14,
  },
});
