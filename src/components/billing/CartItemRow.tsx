import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { LAYOUT } from '../../constants/appConstants';
import { useCartStore } from '../../store/useCartStore';
import type { CartItemModel } from '../../models';

interface CartItemRowProps {
  item: CartItemModel;
}

export const CartItemRow = ({ item }: CartItemRowProps) => {
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const formattedPrice = (item.selling_price * item.quantity).toFixed(2);

  return (
    <View style={styles.container}>
      {/* Product Image & Info */}
      <View style={styles.productInfo}>
        <View style={styles.imageContainer}>
          {item.product?.image ? (
            <Image source={{ uri: item.product.image }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <FontAwesome6 name="camera" size={14} color={COLORS.greyText} />
            </View>
          )}
        </View>
        
        <View style={styles.nameContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.product_name}
          </Text>
          <Text style={styles.unitPrice}>
            {item.selling_price.toFixed(2)} / unit
          </Text>
        </View>
      </View>

      {/* Quantity Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            style={styles.qtyButton} 
            onPress={() => decrementQuantity && decrementQuantity(item.product_id)}
          >
            <FontAwesome6 name="minus" size={12} color={COLORS.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.qtyButton} 
            onPress={() => incrementQuantity && incrementQuantity(item.product_id)}
          >
            <FontAwesome6 name="plus" size={12} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Price & Delete */}
        <View style={styles.priceContainer}>
          <Text style={styles.totalPrice}>{formattedPrice}</Text>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => removeItem && removeItem(item.product_id)}
          >
            <FontAwesome6 name="trash-can" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    backgroundColor: '#fff',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  imageContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1B1F',
    marginBottom: 2,
  },
  unitPrice: {
    fontSize: 12,
    color: COLORS.greyText,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 16,
  },
  qtyButton: {
    padding: 8,
    paddingHorizontal: 12,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
    color: '#1C1B1F',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'flex-end',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 12,
  },
  deleteButton: {
    padding: 8,
  },
});
