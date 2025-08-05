import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { products, Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

export default function OrderScreen() {
  const { productId, selectedSize, selectedColor } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { addToCart, cartItems } = useCart();
  
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  // Find the product
  const product = products.find(p => p.id === productId);

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

  const calculateTotal = () => {
    const subtotal = product.price;
    const shipping = 50; // Fixed shipping cost
    const tax = subtotal * 0.18; // 18% GST
    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
    };
  };

  const handlePlaceOrder = () => {
    // Validate shipping info
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.phone || 
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.pincode) {
      Alert.alert('Error', 'Please fill in all shipping information');
      return;
    }

    // Add to cart with size or color
    const productWithOptions = { 
      ...product, 
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined
    };
    addToCart(productWithOptions);

    const optionText = selectedColor ? `Color: ${selectedColor}` : `Size: ${selectedSize}`;
    Alert.alert(
      'Order Placed Successfully!',
      `Your order for ${product.name} (${optionText}) has been placed.`,
      [
        {
          text: 'View Orders',
          onPress: () => {
            // Navigate to orders screen (you can implement this later)
            router.push('/(tabs)');
          }
        },
        {
          text: 'Continue Shopping',
          onPress: () => {
            router.push('/(tabs)');
          }
        }
      ]
    );
  };

  const totals = calculateTotal();

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
          Checkout
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Summary
          </Text>
          <View style={[styles.orderCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.productName, { color: colors.text }]}>
              {product.name}
            </Text>
            <Text style={[styles.productDetails, { color: colors.tabIconDefault }]}>
              {selectedColor ? `Color: ${selectedColor}` : `Size: ${selectedSize}`} | Qty: 1
            </Text>
            <Text style={[styles.productPrice, { color: colors.text }]}>
              {formatPrice(product.price)}
            </Text>
          </View>
        </View>

        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Shipping Information
          </Text>
          <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Full Name"
                placeholderTextColor={colors.tabIconDefault}
                value={shippingInfo.name}
                onChangeText={(text) => setShippingInfo({...shippingInfo, name: text})}
              />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Email"
                placeholderTextColor={colors.tabIconDefault}
                value={shippingInfo.email}
                onChangeText={(text) => setShippingInfo({...shippingInfo, email: text})}
                keyboardType="email-address"
              />
            </View>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Phone Number"
              placeholderTextColor={colors.tabIconDefault}
              value={shippingInfo.phone}
              onChangeText={(text) => setShippingInfo({...shippingInfo, phone: text})}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Address"
              placeholderTextColor={colors.tabIconDefault}
              value={shippingInfo.address}
              onChangeText={(text) => setShippingInfo({...shippingInfo, address: text})}
              multiline
            />
            
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="City"
                placeholderTextColor={colors.tabIconDefault}
                value={shippingInfo.city}
                onChangeText={(text) => setShippingInfo({...shippingInfo, city: text})}
              />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Pincode"
                placeholderTextColor={colors.tabIconDefault}
                value={shippingInfo.pincode}
                onChangeText={(text) => setShippingInfo({...shippingInfo, pincode: text})}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Payment Summary
          </Text>
          <View style={[styles.paymentCard, { backgroundColor: colors.card }]}>
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: colors.tabIconDefault }]}>
                Subtotal
              </Text>
              <Text style={[styles.paymentValue, { color: colors.text }]}>
                {formatPrice(totals.subtotal)}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: colors.tabIconDefault }]}>
                Shipping
              </Text>
              <Text style={[styles.paymentValue, { color: colors.text }]}>
                {formatPrice(totals.shipping)}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: colors.tabIconDefault }]}>
                Tax (18% GST)
              </Text>
              <Text style={[styles.paymentValue, { color: colors.text }]}>
                {formatPrice(totals.tax)}
              </Text>
            </View>
            <View style={[styles.paymentRow, styles.totalRow]}>
              <Text style={[styles.paymentLabel, styles.totalLabel, { color: colors.text }]}>
                Total
              </Text>
              <Text style={[styles.paymentValue, styles.totalValue, { color: colors.text }]}>
                {formatPrice(totals.total)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.placeOrderButton, { backgroundColor: colors.tint }]}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>
            Place Order - {formatPrice(totals.total)}
          </Text>
        </TouchableOpacity>
      </View>
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  orderCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
    borderRadius: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  paymentCard: {
    padding: 16,
    borderRadius: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 16,
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
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
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  placeOrderButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderText: {
    color: 'white',
    fontSize: 18,
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