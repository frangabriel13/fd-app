import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface ShopSearchBannerProps {
  searchTerm: string;
  onClear: () => void;
}

const ShopSearchBanner = ({ searchTerm, onClear }: ShopSearchBannerProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>Resultados para "{searchTerm}"</Text>
    <Pressable style={styles.clearButton} onPress={onClear}>
      <Ionicons name="close" size={20} color={Colors.gray.semiDark} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  clearButton: {
    padding: 4,
    borderRadius: 4,
  },
});

export default ShopSearchBanner;
