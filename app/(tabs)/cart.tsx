import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { products } from '@/data/products';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useNavigation } from '@react-navigation/native';

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  

  const getProductById = (productId: string) => {
    return products.find(product => product.id === productId);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = getProductById(item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const navigation = useNavigation();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add some items to your cart before checkout.');
      return;
    }
    
    Alert.alert(
      'Checkout',
      `Total: ₹${calculateTotal().toFixed(2)}\n\nProceed to checkout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Checkout', 
          onPress: () => {
            Alert.alert('Success', 'Order placed successfully!');
            clearCart();
          }
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: any }) => {
    const product = getProductById(item.productId);
    if (!product) return null;

    return (
      <View style={[styles.cartItem, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[styles.productPrice, { color: colors.text }]}>
            ₹{product.price.toFixed(0)}
          </Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: colors.tabIconDefault }]}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Text style={[styles.quantityButtonText, { color: colors.text }]}>-</Text>
            </TouchableOpacity>
            
            <Text style={[styles.quantityText, { color: colors.text }]}>
              {item.quantity}
            </Text>
            
            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: colors.tabIconDefault }]}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Text style={[styles.quantityButtonText, { color: colors.text }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.itemActions}>
          <Text style={[styles.itemTotal, { color: colors.text }]}>
            ₹{(product.price * item.quantity).toFixed(0)}
          </Text>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={[styles.removeButtonText, { color: '#FF4444' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Text style={[styles.emptyCartTitle, { color: colors.text }]}>Your cart is empty</Text>
      <Text style={[styles.emptyCartSubtitle, { color: colors.tabIconDefault }]}>
        Add some products to get started
      </Text>
      <TouchableOpacity
        style={[styles.shopNowButton, { backgroundColor: colors.tint }]}
        onPress={() => {
          navigation.navigate('home');
          console.log('Navigate to home');
        }}
      >
        <Text style={styles.shopNowButtonText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header */}
      <Header />

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          {/* Cart Items */}
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {/* Order Summary */}
          <View style={[styles.orderSummary, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>Subtotal</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ₹{calculateSubtotal().toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>Tax (8%)</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ₹{calculateTax().toFixed(2)}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>
                ₹{calculateTotal().toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: colors.tint }]}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>
                Checkout • ₹{calculateTotal().toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    paddingVertical: 4,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderSummary: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E1E5E9',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyCartSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  shopNowButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 