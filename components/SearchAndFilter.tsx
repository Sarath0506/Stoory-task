import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { categories, sortOptions, filterOptions } from '@/data/products';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  selectedFilters: {
    priceRange: string[];
    availability: string[];
    rating: string[];
  };
  onFilterChange: (filters: any) => void;
}

const { width } = Dimensions.get('window');

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  selectedFilters,
  onFilterChange,
}: SearchAndFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleFilterToggle = (filterType: string, filterId: string) => {
    const currentFilters = selectedFilters[filterType as keyof typeof selectedFilters] || [];
    const newFilters = currentFilters.includes(filterId)
      ? currentFilters.filter(id => id !== filterId)
      : [...currentFilters, filterId];
    
    onFilterChange({
      ...selectedFilters,
      [filterType]: newFilters,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      priceRange: [],
      availability: [],
      rating: [],
    });
  };

  const getActiveFilterCount = () => {
    return (
      selectedFilters.priceRange.length +
      selectedFilters.availability.length +
      selectedFilters.rating.length
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { borderColor: colors.tabIconDefault }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.tint} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search products..."
          placeholderTextColor={colors.tabIconDefault}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryItem,
            selectedCategory === 'all' && { backgroundColor: colors.tint },
          ]}
          onPress={() => onCategoryChange('all')}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === 'all' && { color: 'white' },
              { color: colors.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory === category.name && { backgroundColor: colors.tint },
            ]}
            onPress={() => onCategoryChange(category.name)}
          >
            <IconSymbol name={category.icon as any} size={16} color={selectedCategory === category.name ? 'white' : colors.text} style={styles.categoryIcon} />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.name && { color: 'white' },
                { color: colors.text },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort and Filter Bar */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.sortButton, { borderColor: colors.tabIconDefault }]}
          onPress={() => setShowFilters(true)}
        >
          <Text style={[styles.sortButtonText, { color: colors.text }]}>
            Sort & Filter
          </Text>
          {getActiveFilterCount() > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: colors.tint }]}>
              <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortButton, { borderColor: colors.tabIconDefault }]}
          onPress={() => {
            // Show sort options in a simple way
            const currentIndex = sortOptions.findIndex(option => option.id === selectedSort);
            const nextIndex = (currentIndex + 1) % sortOptions.length;
            onSortChange(sortOptions[nextIndex].id);
          }}
        >
          <Text style={[styles.sortButtonText, { color: colors.text }]}>
            {sortOptions.find(option => option.id === selectedSort)?.label || 'Sort'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={[styles.closeButton, { color: colors.tint }]}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                Price Range
              </Text>
              {filterOptions.priceRange.map(range => (
                <TouchableOpacity
                  key={range.id}
                  style={styles.filterOption}
                  onPress={() => handleFilterToggle('priceRange', range.id)}
                >
                  <View style={[
                    styles.checkbox,
                    {
                      backgroundColor: selectedFilters.priceRange.includes(range.id)
                        ? colors.tint
                        : 'transparent',
                      borderColor: colors.tabIconDefault,
                    }
                  ]}>
                    {selectedFilters.priceRange.includes(range.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={[styles.filterOptionText, { color: colors.text }]}>
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Availability */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                Availability
              </Text>
              {filterOptions.availability.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.filterOption}
                  onPress={() => handleFilterToggle('availability', option.id)}
                >
                  <View style={[
                    styles.checkbox,
                    {
                      backgroundColor: selectedFilters.availability.includes(option.id)
                        ? colors.tint
                        : 'transparent',
                      borderColor: colors.tabIconDefault,
                    }
                  ]}>
                    {selectedFilters.availability.includes(option.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={[styles.filterOptionText, { color: colors.text }]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Rating */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                Rating
              </Text>
              {filterOptions.rating.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.filterOption}
                  onPress={() => handleFilterToggle('rating', option.id)}
                >
                  <View style={[
                    styles.checkbox,
                    {
                      backgroundColor: selectedFilters.rating.includes(option.id)
                        ? colors.tint
                        : 'transparent',
                      borderColor: colors.tabIconDefault,
                    }
                  ]}>
                    {selectedFilters.rating.includes(option.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={[styles.filterOptionText, { color: colors.text }]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.clearButton, { borderColor: colors.tabIconDefault }]}
              onPress={clearAllFilters}
            >
              <Text style={[styles.clearButtonText, { color: colors.text }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginLeft: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 0,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1E5E9',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 20,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterOptionText: {
    fontSize: 16,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E5E9',
  },
  clearButton: {
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 