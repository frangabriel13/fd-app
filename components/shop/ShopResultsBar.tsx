import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SortValue, SORT_LABELS } from '@/constants/shop';

interface ShopResultsBarProps {
  totalProducts: number;
  selectedSort: SortValue;
  onOpenSort: () => void;
}

const ShopResultsBar = ({ totalProducts, selectedSort, onOpenSort }: ShopResultsBarProps) => {
  const isNonDefaultSort = selectedSort !== 'featured';

  return (
    <View style={styles.container}>
      <Text style={styles.resultsText}>
        {totalProducts} {totalProducts === 1 ? 'resultado' : 'resultados'}
      </Text>
      <Pressable
        style={[styles.sortButton, isNonDefaultSort && styles.sortButtonActive]}
        onPress={onOpenSort}
      >
        <Text style={[styles.sortButtonText, isNonDefaultSort && styles.sortButtonTextActive]}>
          {SORT_LABELS[selectedSort]}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color={isNonDefaultSort ? Colors.blue.dark : Colors.gray.dark}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.gray.light,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.gray.dark,
  },
  sortButtonActive: {
    borderColor: Colors.blue.dark,
    backgroundColor: '#eef2ff',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray.dark,
  },
  sortButtonTextActive: {
    color: Colors.blue.dark,
  },
});

export default ShopResultsBar;
