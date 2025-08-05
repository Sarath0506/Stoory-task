import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Product } from '@/data/products';

interface VariantSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onVariantSelect: (variant: string) => void;
  product: Product;
}

function getVariantsFromTags(tags: string[]): string[] {
  // Extract ml, color, shade, or known shade names
  const mlVariants = tags.filter(tag => /\d+ml/i.test(tag));
  const shadeVariants = tags.filter(tag => /shade|color|beige|pink|red|rose|coral|nude|matte|glow|spf/i.test(tag));
  // Remove duplicates
  const allVariants = Array.from(new Set([...mlVariants, ...shadeVariants]));
  return allVariants;
}

const VariantSelectionModal: React.FC<VariantSelectionModalProps> = ({ visible, onClose, onVariantSelect, product }) => {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const variants = getVariantsFromTags(product.tags);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select Variant</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <FlatList
            data={variants}
            keyExtractor={item => item}
            numColumns={3}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.variantButton, selectedVariant === item && styles.selectedVariant]}
                onPress={() => setSelectedVariant(item)}
              >
                <Text style={styles.variantText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, !selectedVariant && { opacity: 0.5 }]}
              onPress={() => selectedVariant && onVariantSelect(selectedVariant)}
              disabled={!selectedVariant}
            >
              <Text style={styles.confirmText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productName: {
    fontSize: 15,
    marginBottom: 16,
    color: '#666',
    textAlign: 'center',
  },
  grid: {
    alignItems: 'center',
    marginBottom: 20,
  },
  variantButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  selectedVariant: {
    backgroundColor: '#e0e0e0',
    borderColor: '#333',
  },
  variantText: {
    fontSize: 14,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelText: {
    color: '#888',
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VariantSelectionModal;