import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { categories, products } from '@/data/products';
import { router } from 'expo-router';
import Header from '@/components/Header';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Get featured products (products with high ratings or on sale)
  const featuredProducts = products
    .filter(product => product.rating >= 4.5 || product.isOnSale)
    .slice(0, 6);

  // Get trending products (products with high review counts)
  const trendingProducts = products
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);

  const handleCategoryPress = (categoryName: string) => {
    // Navigate to home screen with category filter
    router.push({
      pathname: '/(tabs)',
      params: { category: categoryName }
    });
  };

  const handleProductPress = (productId: string) => {
    // Navigate to product details (would be implemented later)
    console.log('Navigate to product:', productId);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(0)}`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }

    return stars.join('');
  };

  const allowedCategories = ['Electronics', 'Fashion', 'Beauty'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header />

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.filter(category => allowedCategories.includes(category.name)).map(category => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}
                onPress={() => handleCategoryPress(category.name)}
              >
                <IconSymbol name={category.icon as any} size={24} color={colors.tint} style={styles.categoryIcon} />
                <Text style={[styles.categoryName, { color: colors.text }]}>
                  {category.name}
                </Text>
                <Text style={[styles.categoryCount, { color: colors.tabIconDefault }]}>
                  {category.productCount} items
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {featuredProducts.map(product => (
              <TouchableOpacity
                key={product.id}
                style={[styles.productCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}
                onPress={() => handleProductPress(product.id)}
              >
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text
                    style={[styles.productName, { color: colors.text }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {product.name}
                  </Text>
                  <View style={styles.productMeta}>
                    <Text style={[styles.productPrice, { color: colors.text }]}>
                      {formatPrice(product.price)}
                    </Text>
                    <Text style={[styles.productRating, { color: '#FFD700' }]}>
                      {renderStars(product.rating)}
                    </Text>
                  </View>
                  {product.isOnSale && (
                    <View style={styles.saleBadge}>
                      <Text style={styles.saleText}>SALE</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending Products */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Now</Text>
          <View style={styles.trendingGrid}>
            {trendingProducts.map(product => (
              <TouchableOpacity
                key={product.id}
                style={[styles.trendingCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}
                onPress={() => handleProductPress(product.id)}
              >
                <Image source={{ uri: product.image }} style={styles.trendingImage} />
                <View style={styles.trendingInfo}>
                  <Text
                    style={[styles.trendingName, { color: colors.text }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {product.name}
                  </Text>
                  <Text style={[styles.trendingPrice, { color: colors.text }]}>
                    {formatPrice(product.price)}
                  </Text>
                  <View style={styles.trendingMeta}>
                    <Text style={[styles.trendingRating, { color: '#FFD700' }]}>
                      {renderStars(product.rating)}
                    </Text>
                    <Text style={[styles.trendingReviews, { color: colors.tabIconDefault }]}>
                      ({product.reviewCount})
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Special Offers */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Special Offers</Text>
          <View style={[styles.offerCard, { backgroundColor: colors.tint }]}>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>Flash Sale</Text>
              <Text style={styles.offerSubtitle}>Up to 50% off on selected items</Text>
              <TouchableOpacity style={styles.offerButton}>
                <Text style={styles.offerButtonText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.offerImageContainer}>
              <Text style={styles.offerEmoji}>🔥</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: (width - 44) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  productCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 18,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productRating: {
    fontSize: 12,
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saleText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trendingGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  trendingCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  trendingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  trendingInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  trendingName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  trendingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingRating: {
    fontSize: 12,
    marginRight: 4,
  },
  trendingReviews: {
    fontSize: 12,
  },
  offerCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerContent: {
    flex: 1,
  },
  offerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  offerSubtitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.9,
  },
  offerButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  offerButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  offerImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerEmoji: {
    fontSize: 32,
  },
});
