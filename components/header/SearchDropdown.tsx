import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { TouchableOpacity, View, Text, FlatList } from 'react-native';
import { Colors } from '@/constants/Colors';

const dropdownStyle = {
  top: 44,
  maxHeight: 420,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
};

const sectionTitleStyle = {
  fontSize: 11,
  fontWeight: '700' as const,
  color: Colors.gray.default,
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5,
};

interface Product {
  id: string;
  name: string;
}

interface Manufacturer {
  id: string;
  name: string;
}

interface SearchDropdownProps {
  searchText: string;
  products: Product[];
  manufacturers: Manufacturer[];
  hasResults: boolean;
  showEmpty: boolean;
  onProductPress: (id: string) => void;
  onManufacturerPress: (id: string) => void;
  onSeeAll: () => void;
}

const SearchDropdown = memo(function SearchDropdown({
  searchText,
  products,
  manufacturers,
  hasResults,
  showEmpty,
  onProductPress,
  onManufacturerPress,
  onSeeAll,
}: SearchDropdownProps) {
  return (
    <View
      className="absolute left-0 right-0 bg-white rounded-xl z-50 border border-gray-100"
      style={dropdownStyle}
    >
      {showEmpty ? (
        <View className="items-center py-7 px-4 gap-1.5">
          <Ionicons name="search-outline" size={28} color={Colors.gray.default} />
          <Text className="text-base font-mont-bold" style={{ color: '#1a1a1a' }}>Sin resultados</Text>
          <Text className="text-sm text-center font-mont-regular" style={{ color: Colors.gray.default }}>
            No encontramos nada para "{searchText}"
          </Text>
        </View>
      ) : (
        <FlatList
          keyboardShouldPersistTaps="handled"
          className="rounded-xl"
          data={[]}
          renderItem={null}
          ListHeaderComponent={
            <>
              {/* Productos */}
              {products.length > 0 && (
                <View>
                  <View className="flex-row items-center gap-1.5 px-3.5 py-2 bg-gray-50 border-b border-gray-100">
                    <Ionicons name="cube-outline" size={14} color={Colors.gray.default} />
                    <Text style={sectionTitleStyle}>Productos</Text>
                  </View>
                  {products.map((product) => (
                    <TouchableOpacity
                      key={`product-${product.id}`}
                      onPress={() => onProductPress(product.id)}
                      className="flex-row items-center justify-between px-3.5 py-3 border-b border-gray-100"
                    >
                      <Text className="flex-1 text-sm font-mont-regular" style={{ color: '#1a1a1a' }} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Ionicons name="chevron-forward" size={14} color={Colors.gray.default} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Fabricantes */}
              {manufacturers.length > 0 && (
                <View>
                  <View className="flex-row items-center gap-1.5 px-3.5 py-2 bg-gray-50 border-b border-gray-100">
                    <Ionicons name="business-outline" size={14} color={Colors.gray.default} />
                    <Text style={sectionTitleStyle}>Fabricantes</Text>
                  </View>
                  {manufacturers.map((manufacturer) => (
                    <TouchableOpacity
                      key={`manufacturer-${manufacturer.id}`}
                      onPress={() => onManufacturerPress(manufacturer.id)}
                      className="flex-row items-center justify-between px-3.5 py-3 border-b border-gray-100"
                    >
                      <Text className="flex-1 text-sm font-mont-regular" style={{ color: '#1a1a1a' }} numberOfLines={1}>
                        {manufacturer.name}
                      </Text>
                      <Ionicons name="chevron-forward" size={14} color={Colors.gray.default} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Ver todos los resultados */}
              {searchText.trim() && hasResults && (
                <TouchableOpacity onPress={onSeeAll} className="flex-row items-center justify-center gap-1.5 py-3 border-t border-gray-100">
                  <Ionicons name="search" size={14} color={Colors.orange.dark} />
                  <Text className="text-sm font-semibold text-secondary">
                    Ver todos los resultados para "{searchText}"
                  </Text>
                </TouchableOpacity>
              )}
            </>
          }
        />
      )}
    </View>
  );
});

export default SearchDropdown;
