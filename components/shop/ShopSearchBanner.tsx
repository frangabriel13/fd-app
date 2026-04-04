import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface ShopSearchBannerProps {
  searchTerm: string;
  onClear: () => void;
}

const ShopSearchBanner = ({ searchTerm, onClear }: ShopSearchBannerProps) => (
  <View style={styles.container}>
    <Ionicons name="search" size={15} color={Colors.blue.dark} />
    <Text style={styles.title} numberOfLines={1}>
      Resultados para{' '}
      <Text style={styles.term}>"{searchTerm}"</Text>
    </Text>
    <Pressable
      style={styles.clearButton}
      onPress={onClear}
      accessibilityLabel="Limpiar búsqueda"
    >
      <Ionicons name="close" size={15} color={Colors.blue.dark} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#eef2ff',
    borderBottomWidth: 1,
    borderBottomColor: '#c7d2fe',
  },
  title: {
    flex: 1,
    fontSize: 13,
    color: Colors.gray.dark,
  },
  term: {
    fontWeight: '700',
    color: Colors.blue.dark,
  },
  clearButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#c7d2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShopSearchBanner;
