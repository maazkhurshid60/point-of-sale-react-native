import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useProductStore } from '../../store/useProductStore';
import { ProductCard } from './ProductCard';
import { ProductSearchBar } from './ProductSearchBar';
import { CategorySelector } from './CategorySelector';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

interface ProductsListingProps {
  isGridView?: boolean;
}

export const ProductsListing: React.FC<ProductsListingProps> = ({ isGridView = true }) => {
  const { width } = useWindowDimensions();
  const isPortrait = width < 610;
  
  const listOfProducts = useProductStore((state) => state.listOfProducts);
  const isLoading = useProductStore((state) => state.isLoading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const nextPageUrl = useProductStore((state) => state.nextPageUrl);

  useEffect(() => {
    fetchProducts('all', false);
  }, []);

  const handleLoadMore = () => {
    if (nextPageUrl && !isLoading) {
      fetchProducts('all', true);
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
              onPress={(p) => console.log("Product selected", p.product_name)}
            />
          </View>
        )}
        numColumns={isGridView ? (isPortrait ? 3 : 5) : 1}
        key={isGridView ? (isPortrait ? 'grid3' : 'grid5') : 'list'}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Products Available</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'space-between',
  },
  subtitle: {
    ...TYPOGRAPHY.montserrat.semiBold,
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
