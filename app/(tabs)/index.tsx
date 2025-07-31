import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { products, Product, filterOptions } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import SearchAndFilter from '@/components/SearchAndFilter';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [],
    availability: [],
    rating: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { addToCart } = useCart();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    if (selectedFilters.priceRange.length > 0) {
      filtered = filtered.filter(product => {
        return selectedFilters.priceRange.some(rangeId => {
          const range = filterOptions.priceRange.find(r => r.id === rangeId);
          if (!range) return false;
          return product.price >= range.min && product.price <= range.max;
        });
      });
    }

    // Availability filter
    if (selectedFilters.availability.length > 0) {
      filtered = filtered.filter(product => {
        return selectedFilters.availability.some(filterId => {
          switch (filterId) {
            case 'in-stock':
              return product.inStock;
            case 'on-sale':
              return product.isOnSale;
            case 'new':
              return product.isNew;
            default:
              return false;
          }
        });
      });
    }

    // Rating filter
    if (selectedFilters.rating.length > 0) {
      filtered = filtered.filter(product => {
        return selectedFilters.rating.some(filterId => {
          const ratingFilter = filterOptions.rating.find(r => r.id === filterId);
          if (!ratingFilter) return false;
          return product.rating >= ratingFilter.min;
        });
      });
    }

    // Sort products
    switch (selectedSort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0));
        break;
      default:
        // popularity (default)
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedSort, selectedFilters]);

  const handleProductPress = (product: Product) => {
    Alert.alert(
      product.name,
      `${product.description}\n\nPrice: ₹${product.price}\nRating: ${product.rating}/5 (${product.reviewCount} reviews)`,
      [
        { 
          text: 'Add to Cart', 
          onPress: () => {
            addToCart(product);
            Alert.alert('Success', `${product.name} added to cart!`);
          }
        },
        { 
          text: 'View Details', 
          onPress: () => {
            Alert.alert('Product Details', `Detailed view for ${product.name} would be shown here.`);
          }
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderHeader = () => (
    <Header />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyStateText, { color: colors.tabIconDefault }]}>
        No products found
      </Text>
      <Text style={[styles.emptyStateSubtext, { color: colors.tabIconDefault }]}>
        Try adjusting your search or filters
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
        ListHeaderComponent={
          <>
            {renderHeader()}
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
            />
          </>
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.tint}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  productList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
