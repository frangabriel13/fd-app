import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SortValue, SORT_LABELS } from '@/constants/shop';

interface ShopResultsBarProps {
  totalProducts: number;
  selectedSort: SortValue;
  onOpenSort: () => void;
}

const ShopResultsBar = ({ totalProducts, selectedSort, onOpenSort }: ShopResultsBarProps) => (
  <View style={styles.container}>
    {/* Cantidad de resultados */}
    <View style={styles.resultsRow}>
      <Text style={styles.resultsCount}>{totalProducts}</Text>
      <Text style={styles.resultsLabel}>
        {totalProducts === 1 ? 'resultado' : 'resultados'}
      </Text>
    </View>

    {/* Botón de ordenamiento */}
    <Pressable
      style={({ pressed }) => [
        styles.sortButton,
        pressed && styles.sortButtonPressed,
      ]}
      onPress={onOpenSort}
      hitSlop={8}
    >
      <View style={styles.sortButtonInner}>
        <Text style={styles.sortButtonText}>
          {SORT_LABELS[selectedSort]}
        </Text>
        <Ionicons
          name="chevron-down"
          size={13}
          color={Colors.blue.dark}
        />
      </View>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  // — Resultados —
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  resultsCount: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.blue.dark,
  },
  resultsLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.gray.semiDark,
  },

  // — Botón de orden —
  sortButton: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: Colors.gray.light,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sortButtonPressed: {
    opacity: 0.75,
  },
  sortButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.blue.dark,
  },
});

export default ShopResultsBar;
