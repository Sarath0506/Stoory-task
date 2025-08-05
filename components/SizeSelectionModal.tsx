import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Product } from '@/data/products';

interface SizeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSizeSelect: (size: string) => void;
  product: Product;
}

const { width } = Dimensions.get('window');

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

export default function SizeSelectionModal({ 
  visible, 
  onClose, 
  onSizeSelect, 
  product 
}: SizeSelectionModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(0)}`;
  };

  const handleSizeSelect = (size: string) => {
    onSizeSelect(size);
    onClose();
  };

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
              Select Size
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

          {/* Size Options */}
          <View style={styles.sizeContainer}>
            <Text style={[styles.sizeTitle, { color: colors.text }]}>
              Available Sizes
            </Text>
            <View style={styles.sizeGrid}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[styles.sizeButton, { 
                    backgroundColor: colors.card,
                    borderColor: colors.border
                  }]}
                  onPress={() => handleSizeSelect(size)}
                >
                  <Text style={[styles.sizeText, { color: colors.text }]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Size Guide */}
          <View style={styles.sizeGuide}>
            <Text style={[styles.guideTitle, { color: colors.text }]}>
              Size Guide
            </Text>
            <View style={styles.guideRow}>
              <Text style={[styles.guideLabel, { color: colors.tabIconDefault }]}>S</Text>
              <Text style={[styles.guideValue, { color: colors.tabIconDefault }]}>Small (36-38)</Text>
            </View>
            <View style={styles.guideRow}>
              <Text style={[styles.guideLabel, { color: colors.tabIconDefault }]}>M</Text>
              <Text style={[styles.guideValue, { color: colors.tabIconDefault }]}>Medium (38-40)</Text>
            </View>
            <View style={styles.guideRow}>
              <Text style={[styles.guideLabel, { color: colors.tabIconDefault }]}>L</Text>
              <Text style={[styles.guideValue, { color: colors.tabIconDefault }]}>Large (40-42)</Text>
            </View>
            <View style={styles.guideRow}>
              <Text style={[styles.guideLabel, { color: colors.tabIconDefault }]}>XL</Text>
              <Text style={[styles.guideValue, { color: colors.tabIconDefault }]}>Extra Large (42-44)</Text>
            </View>
            <View style={styles.guideRow}>
              <Text style={[styles.guideLabel, { color: colors.tabIconDefault }]}>XXL</Text>
              <Text style={[styles.guideValue, { color: colors.tabIconDefault }]}>Double XL (44-46)</Text>
            </View>
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
  sizeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sizeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sizeButton: {
    width: (width - 80) / 3,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sizeGuide: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  guideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  guideLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 40,
  },
  guideValue: {
    fontSize: 14,
    flex: 1,
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