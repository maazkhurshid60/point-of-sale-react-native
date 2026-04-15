import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import { ProductCard } from './ProductCard';
import { ProductSearchBar } from './ProductSearchBar';
import { CategorySelector } from './CategorySelector';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

interface ProductsListingProps {
  isGridView?: boolean;
  columns?: number;
}

export const ProductsListing: React.FC<ProductsListingProps> = ({ 
  isGridView = true,
  columns 
}) => {
  const { width } = useWindowDimensions();
  const isPortrait = width < 610;

  const listOfProducts = useProductStore((state) => state.listOfProducts);
  const isLoading = useProductStore((state) => state.isLoading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const nextPageUrl = useProductStore((state) => state.nextPageUrl);
  const prevPageUrl = useProductStore((state) => state.prevPageUrl);
  const currentPage = useProductStore((state) => state.currentPage);

  useEffect(() => {
    fetchProducts('all', false, 1);
  }, []);

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && nextPageUrl) {
      fetchProducts('all', false, currentPage + 1);
    } else if (direction === 'prev' && prevPageUrl) {
      fetchProducts('all', false, currentPage - 1);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Products</Text>
        <ProductSearchBar />
      </View>
      <View style={styles.filterRow}>
        <Text style={styles.subtitle}>Select Category</Text>
        <View style={styles.selectorWrapper}>
          <CategorySelector />
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );

  const renderFooter = () => (
    isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    ) : null
  );

  const addItem = useCartStore((state) => state.addItem);

  const getNumColumns = () => {
    if (columns) return columns;
    if (!isGridView) return 1;
    if (width < 600) return 2;
    if (width < 900) return 3;
    if (width < 1200) return 4;
    return 5;
  };

  const numColumns = getNumColumns();

  return (
    <View style={styles.container}>
      <FlatList
        data={listOfProducts}
        keyExtractor={(item) => item.product_id.toString()}
        renderItem={({ item }) => (
          <View style={isGridView ? styles.gridItem : styles.listItem}>
            <ProductCard
              product={item}
              isGridView={isGridView}
              numColumns={numColumns}
              onPress={(p) => addItem(p)}
            />
          </View>
        )}
        numColumns={numColumns}
        key={`${isGridView ? 'grid' : 'list'}-${numColumns}`}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={renderFooter()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Products Available</Text>
            </View>
          ) : null
        }
      />

      {/* Stationary Pagination UI */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.pageButton, !prevPageUrl && styles.disabledButton]} 
          onPress={() => handlePageChange('prev')}
          disabled={!prevPageUrl || isLoading}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageNumber}>Page {currentPage}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.pageButton, !nextPageUrl && styles.disabledButton]} 
          onPress={() => handlePageChange('next')}
          disabled={!nextPageUrl || isLoading}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
    gap: 10,
  },
  pageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: '#fff',
    fontSize: 12,
  },
  pageIndicator: {
    paddingHorizontal: 10,
  },
  pageNumber: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 14,
    color: '#646464',
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
    color: '#646464',
    marginRight: 10,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: "center",
    justifyContent: 'space-between',
  },
  subtitle: {
    ...TYPOGRAPHY.montserrat.semiBold,
    marginTop: "10%",
    fontSize: 12,
    color: '#999',
  },
  selectorWrapper: {
    width: 200,
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 10,
  },
  gridItem: {
    flex: 1,
    margin: 8,
  },
  listItem: {
    width: '100%',
    paddingHorizontal: 10,
  },
  loader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    ...TYPOGRAPHY.montserrat.regular,
    color: '#999',
  },
});
