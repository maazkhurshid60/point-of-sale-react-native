import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useCartStore } from '../../store/useCartStore';
import { CartItemRow } from '../../components/billing/CartItemRow';
import { BillingFooter } from '../../components/billing/BillingFooter';

const { width } = Dimensions.get('window');

export default function POSScreen() {
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <View style={styles.mainContent}>
      {/* Cart Listing Header */}
      <View style={styles.cartHeader}>
        <Text style={styles.cartHeaderText}>Current Sale</Text>
        <Pressable
          onPress={clearCart}
          style={({ pressed }) => [
            { opacity: pressed ? 0.6 : 1 }
          ]}
        >
          <Text style={styles.clearText}>Clear Cart</Text>
        </Pressable>
      </View>

      {/* Dynamic Cart List */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product_id?.toString() || Math.random().toString()}
        renderItem={({ item }) => <CartItemRow item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="cart-shopping" size={48} color="#e5e7eb" />
            <Text style={styles.emptyText}>Your cart is empty.</Text>
            <Text style={styles.emptySubText}>Select products from the left menu to start billing.</Text>
          </View>
        }
      />

      {/* Totals & Actions */}
      <BillingFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cartHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1B1F',
  },
  clearText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
});
