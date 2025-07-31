import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.background }]}
      onPress={() => onPress(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        {/* Sale Badge */}
        {product.isOnSale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleText}>SALE</Text>
          </View>
        )}
        
        {/* New Badge */}
        {product.isNew && (
          <View style={[styles.newBadge, { backgroundColor: colors.tint }]}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
        
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.name, { color: colors.text }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.text }]}>
            {formatPrice(product.price)}
          </Text>
          {product.originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.tabIconDefault }]}>
              {formatPrice(product.originalPrice)}
            </Text>
          )}
        </View>

        <View style={styles.ratingContainer}>
          <Text style={[styles.stars, { color: '#FFD700' }]}>
            {renderStars(product.rating)}
          </Text>
          <Text style={[styles.reviewCount, { color: colors.tabIconDefault }]}>
            ({product.reviewCount})
          </Text>
        </View>

        <Text
          style={[styles.description, { color: colors.tabIconDefault }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {product.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.1)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: cardWidth * 0.8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saleText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stars: {
    fontSize: 12,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
}); 