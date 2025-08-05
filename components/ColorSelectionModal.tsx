import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Product } from '@/data/products';

interface ColorSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  product: Product;
}

const { width } = Dimensions.get('window');

// Define color options for different electronic products
const getColorOptions = (productName: string) => {
  switch (productName) {
    case 'iPhone 15 Pro':
      return [
        { name: 'Natural Titanium', hex: '#E3C5A8' },
        { name: 'Blue Titanium', hex: '#4A5D7C' },
        { name: 'White Titanium', hex: '#F5F5F5' },
        { name: 'Black Titanium', hex: '#2C2C2C' },
      ];
    case 'Samsung Galaxy S24':
      return [
        { name: 'Phantom Black', hex: '#1A1A1A' },
        { name: 'Marble Gray', hex: '#8B8B8B' },
        { name: 'Cobalt Violet', hex: '#6B4E71' },
        { name: 'Amber Yellow', hex: '#FFB800' },
      ];
    case 'MacBook Air M3':
      return [
        { name: 'Space Gray', hex: '#4A4A4A' },
        { name: 'Silver', hex: '#E5E5E5' },
        { name: 'Midnight', hex: '#1D1D1F' },
        { name: 'Starlight', hex: '#F5F5F0' },
      ];
    case 'PlayStation 5':
      return [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Cosmic Red', hex: '#FF0000' },
        { name: 'Nova Pink', hex: '#FF69B4' },
      ];
    case 'Sony WH-1000XM5':
      return [
        { name: 'Black', hex: '#000000' },
        { name: 'Silver', hex: '#C0C0C0' },
        { name: 'Blue', hex: '#4169E1' },
      ];
    case 'Apple Watch Series 9':
      return [
        { name: 'Midnight', hex: '#1D1D1F' },
        { name: 'Starlight', hex: '#F5F5F0' },
        { name: 'Silver', hex: '#E5E5E5' },
        { name: 'Red', hex: '#FF3B30' },
        { name: 'Blue', hex: '#007AFF' },
      ];
    default:
      return [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Silver', hex: '#C0C0C0' },
      ];
  }
};

export default function ColorSelectionModal({ 
  visible, 
  onClose, 
  onColorSelect, 
  product 
}: ColorSelectionModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(0)}`;
  };

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    onClose();
  };

  const colorOptions = getColorOptions(product.name);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Select Color
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: colors.tint }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: colors.text }]}>
              {product.name}
            </Text>
            <Text style={[styles.productPrice, { color: colors.text }]}>
              {formatPrice(product.price)}
            </Text>
          </View>

          {/* Color Options */}
          <View style={styles.colorContainer}>
            <Text style={[styles.colorTitle, { color: colors.text }]}>
              Available Colors
            </Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color.name}
                  style={[styles.colorButton, { 
                    backgroundColor: colors.card,
                    borderColor: colors.border
                  }]}
                  onPress={() => handleColorSelect(color.name)}
                >
                  <View style={[styles.colorSwatch, { backgroundColor: color.hex }]} />
                  <Text style={[styles.colorText, { color: colors.text }]}>
                    {color.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Info */}
          <View style={styles.colorInfo}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Color Information
            </Text>
            <Text style={[styles.infoText, { color: colors.tabIconDefault }]}>
              All colors are subject to availability. The actual color may vary slightly from the images shown.
            </Text>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  colorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  colorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorButton: {
    width: (width - 80) / 2,
    height: 80,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  colorInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 