import React, { useState } from 'react';
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

interface ShoeSizeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSizeSelect: (size: string) => void;
  product: Product;
}

const { width } = Dimensions.get('window');
const shoeSizes = ['6', '7', '8', '9', '10', '11', '12'];

export default function ShoeSizeSelectionModal({
  visible,
  onClose,
  onSizeSelect,
  product,
}: ShoeSizeSelectionModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const formatPrice = (price: number) => `₹${price.toFixed(0)}`;

  const handleContinue = () => {
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please select a shoe size to continue.');
      return;
    }
    onSizeSelect(selectedSize);
    setSelectedSize(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedSize(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>  
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: '#ccc' }]}>  
            <Text style={[styles.headerTitle, { color: colors.text }]}>Select Shoe Size</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={[styles.closeButton, { color: colors.tint }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
            <Text style={[styles.productPrice, { color: colors.text }]}>{formatPrice(product.price)}</Text>
          </View>

          {/* Shoe Size Options */}
          <View style={styles.sizeContainer}>
            <Text style={[styles.sizeTitle, { color: colors.text }]}>Available Sizes</Text>
            <View style={styles.sizeGrid}>
              {shoeSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[styles.sizeButton, {
                    backgroundColor: selectedSize === size ? colors.tint : colors.background,
                    borderColor: selectedSize === size ? colors.tint : '#ccc',
                  }]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.sizeText, { color: selectedSize === size ? 'white' : colors.text }]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: colors.tint }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
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
  continueButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});