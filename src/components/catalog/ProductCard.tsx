import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ProductModel } from '../../models';
import { ScreenUtil } from '../../utils/ScreenUtil';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

interface ProductCardProps {
  product: ProductModel;
  onPress?: (product: ProductModel) => void;
  isGridView?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  isGridView = true
}) => {
  const { width } = useWindowDimensions();
  const isPortrait = width < 610;

  const isOutOfStock = (product.count?.total || 0) <= 0;

  // Grid Layout
  if (isGridView) {
    return (
      <TouchableOpacity
        style={[styles.gridContainer, isOutOfStock && styles.outOfStockContainer]}
        onPress={() => !isOutOfStock && onPress?.(product)}
        disabled={isOutOfStock}
      >
        {/* Product Image */}
        <View style={styles.imageWrapper}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.gridImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <FontAwesome6 name="image" size={24} color="#ccc" />
            </View>
          )}

          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.product_name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>
              Rs. {Number(product.selling_price).toLocaleString()}
            </Text>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>
                Qty: {product.count?.total || 0}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // List Layout (for Mobile/Expanded Billing)
  return (
    <TouchableOpacity
      style={[styles.listContainer, isOutOfStock && styles.outOfStockContainer]}
      onPress={() => !isOutOfStock && onPress?.(product)}
      disabled={isOutOfStock}
    >
      <View style={styles.row}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.listImage} />
        ) : (
          <View style={[styles.listImage, styles.placeholderImage]}>
            <FontAwesome6 name="image" size={16} color="#ccc" />
          </View>
        )}

        <View style={styles.listInfo}>
          <Text style={styles.productName}>{product.product_name}</Text>
          <Text style={styles.priceText}>
            Rs. {Number(product.selling_price).toLocaleString()}
          </Text>
        </View>

        <View style={styles.listStock}>
          <Text style={[styles.stockText, { color: isOutOfStock ? COLORS.posRed : '#666' }]}>
            Stock: {product.count?.total || 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  outOfStockContainer: {
    opacity: 0.6,
  },
  imageWrapper: {
    height: 120,
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: COLORS.posRed,
    fontSize: 10,
    textAlign: 'center',
  },
  infoContainer: {
    padding: 10,
  },
  productName: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: ScreenUtil.setSpText(14),
    color: COLORS.textDark,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: ScreenUtil.setSpText(14),
    color: COLORS.primary,
  },
  stockBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 10,
    color: '#666',
  },
  // List Styles
  listContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  listInfo: {
    flex: 1,
    marginLeft: 12,
  },
  listStock: {
    marginLeft: 10,
  },
});
