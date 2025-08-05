import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { products, Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import SizeSelectionModal from '@/components/SizeSelectionModal';
import ColorSelectionModal from '@/components/ColorSelectionModal';
import ShoeSizeSelectionModal from '@/components/ShoeSizeSelectionModal';
import VariantSelectionModal from '@/components/VariantSelectionModal';

const { width, height } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showShoeSizeModal, setShowShoeSizeModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantToSelect, setVariantToSelect] = useState<string | null>(null);

  // Find the product by ID
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Product not found
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.tint }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const getVariantsFromTags = (tags: string[]): string[] => {
    const mlVariants = tags.filter(tag => /\d+ml/i.test(tag));
    const shadeVariants = tags.filter(tag => /shade|color|beige|pink|red|rose|coral|nude|matte|glow|spf/i.test(tag));
    return Array.from(new Set([...mlVariants, ...shadeVariants]));
  };

  const handleBuyNow = () => {
    if (product.category === 'Electronics') {
      setShowColorModal(true);
      return;
    }
    if (product.category === 'Fashion') {
      if (product.tags.some(tag => ['shoes', 'sneaker', 'running', 'sports'].includes(tag))) {
        setShowShoeSizeModal(true);
        return;
      }
      setShowSizeModal(true);
      return;
    }
    if (product.category === 'Beauty') {
      const variants = getVariantsFromTags(product.tags);
      if (variants.length > 0) {
        setShowVariantModal(true);
        return;
      }
      router.push({
        pathname: '/order',
        params: { productId: product.id },
      });
      return;
    }
  };

  const handleVariantSelect = (variant: string) => {
    setShowVariantModal(false);
    router.push({
      pathname: '/order',
      params: { productId: product.id, selectedVariant: variant },
    });
  };

  const handleSizeSelect = (size: string) => {
    router.push({
      pathname: '/order',
      params: { 
        productId: product.id,
        selectedSize: size
      }
    });
  };

  const handleColorSelect = (color: string) => {
    router.push({
      pathname: '/order',
      params: { 
        productId: product.id,
        selectedColor: color
      }
    });
  };

  const handleShoeSizeSelect = (size: string) => {
    router.push({
      pathname: '/order',
      params: {
        productId: product.id,
        selectedSize: size,
      },
    });
  };

  // Generate multiple images for the product (in a real app, these would come from the product data)
  const productImages = [
    product.image,
    product.image, // In a real app, you'd have multiple images
    product.image,
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: colors.tint }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Product Details
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: productImages[selectedImageIndex] }} style={styles.mainImage} />
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {productImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  selectedImageIndex === index && { backgroundColor: colors.tint }
                ]}
              />
            ))}
          </View>

          {/* Badges */}
          {product.isOnSale && (
            <View style={styles.saleBadge}>
              <Text style={styles.saleText}>SALE</Text>
            </View>
          )}
          
          {product.isNew && (
            <View style={[styles.newBadge, { backgroundColor: colors.tint }]}>
              <Text style={styles.newText}>NEW</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]}>
            {product.name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text style={[styles.stars, { color: '#FFD700' }]}>
              {renderStars(product.rating)}
            </Text>
            <Text style={[styles.ratingText, { color: colors.tabIconDefault }]}>
              {product.rating}/5 ({product.reviewCount} reviews)
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.text }]}>
              {formatPrice(product.price)}
            </Text>
            {product.originalPrice && (
              <Text style={[styles.originalPrice, { color: colors.tabIconDefault }]}>
                {formatPrice(product.originalPrice)}
              </Text>
            )}
            {product.isOnSale && (
              <Text style={[styles.discountText, { color: '#FF4444' }]}>
                {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
              </Text>
            )}
          </View>

          {/* Availability */}
          <View style={styles.availabilityContainer}>
            <Text style={[
              styles.availabilityText,
              { color: product.inStock ? '#4CAF50' : '#FF4444' }
            ]}>
              {product.inStock ? '● In Stock' : '● Out of Stock'}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colors.tabIconDefault }]}>
              {product.description}
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Key Features
            </Text>
            {product.tags.map((tag, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={[styles.featureText, { color: colors.tabIconDefault }]}>
                  • {tag}
                </Text>
              </View>
            ))}
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Customer Reviews
            </Text>
            <View style={styles.reviewSummary}>
              <Text style={[styles.reviewSummaryText, { color: colors.tabIconDefault }]}>
                Based on {product.reviewCount} reviews
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: colors.tint }]}
          onPress={handleAddToCart}
          disabled={!product.inStock}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.buyNowButton, { backgroundColor: '#4CAF50' }]}
          onPress={handleBuyNow}
          disabled={!product.inStock}
        >
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* Size Selection Modal */}
      <SizeSelectionModal
        visible={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        onSizeSelect={handleSizeSelect}
        product={product}
      />

      {/* Color Selection Modal */}
      <ColorSelectionModal
        visible={showColorModal}
        onClose={() => setShowColorModal(false)}
        onColorSelect={handleColorSelect}
        product={product}
      />

      {/* Shoe Size Selection Modal */}
      <ShoeSizeSelectionModal
        visible={showShoeSizeModal}
        onClose={() => setShowShoeSizeModal(false)}
        onSizeSelect={handleShoeSizeSelect}
        product={product}
      />

      {/* Variant Selection Modal */}
      <VariantSelectionModal
        visible={showVariantModal}
        onClose={() => setShowVariantModal(false)}
        onVariantSelect={handleVariantSelect}
        product={product}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: height * 0.4,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: 8,
  },
  saleBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  newBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  newText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 30,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stars: {
    fontSize: 16,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  availabilityContainer: {
    marginBottom: 16,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  reviewSummary: {
    marginTop: 8,
  },
  reviewSummaryText: {
    fontSize: 14,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  addToCartButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  buyNowButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
}); 