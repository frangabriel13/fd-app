import { Ionicons } from '@expo/vector-icons';
import { useRef, useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { fetchSearchResults, clearSearchResults } from '@/store/slices/productSlice';
import { Colors } from '@/constants/Colors';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';

interface SearchProps {
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

const Search = ({ isExpanded, onExpandChange }: SearchProps) => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const dispatch = useAppDispatch();

  const { searchResults, searchLoading } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (searchText.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        dispatch(fetchSearchResults(searchText.trim()));
        setShowResults(true);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      dispatch(clearSearchResults());
      setShowResults(false);
    }
  }, [searchText, dispatch]);

  const resetSearch = () => {
    setSearchText('');
    setShowResults(false);
    dispatch(clearSearchResults());
    textInputRef.current?.blur();
    onExpandChange(false);
  };

  const handleCancel = () => resetSearch();

  const handleFocus = () => {
    onExpandChange(true);
  };

  const handleBlur = () => {
    // Se necesita el delay para que el onPress de los resultados se ejecute
    // antes de que el blur oculte la lista. Sin esto, tocar un resultado
    // cierra el dropdown antes de que el press sea registrado.
    setTimeout(() => {
      if (searchText === '') {
        onExpandChange(false);
      }
      setShowResults(false);
    }, 150);
  };

  const handleSearchNavigation = () => {
    // searchTerm se captura antes del reset para que no se pierda al limpiar el estado
    const searchTerm = searchText.trim();
    if (searchTerm) {
      resetSearch();
      router.push({
        pathname: '/(tabs)/tienda',
        params: { searchTerm }
      });
    }
  };

  const handleProductPress = (productId: string) => {
    resetSearch();
    router.push(`/(tabs)/producto/${productId}`);
  };

  const handleManufacturerPress = (userId: string) => {
    resetSearch();
    router.push(`/(tabs)/store/${userId}`);
  };

  return (
    <>
      <View className="flex-1 z-50">
        <View className="flex-row items-center bg-white rounded-lg h-10 px-2.5">
          {isExpanded ? (
            <TouchableOpacity onPress={handleCancel} className="mr-1 p-0.5">
              <Ionicons name="arrow-back" size={20} color={Colors.gray.semiDark} />
            </TouchableOpacity>
          ) : (
            <Ionicons name="search" size={16} color={Colors.gray.default} style={{ marginRight: 2 }} />
          )}
          <TextInput
            ref={textInputRef}
            placeholder="Buscar productos o fabricantes..."
            placeholderTextColor={Colors.gray.default}
            className="flex-1 px-1.5 font-mont-regular"
            style={{ fontSize: 14, lineHeight: 18, color: '#1a1a1a', paddingVertical: 0, includeFontPadding: false, textAlignVertical: 'center' }}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (searchText.trim()) {
                handleSearchNavigation();
              }
            }}
          />
          {searchLoading && (
            <ActivityIndicator size="small" color={Colors.gray.semiDark} style={{ marginLeft: 4 }} />
          )}
        </View>

        {/* Dropdown de resultados */}
        {showResults && isExpanded && (
          <View
            className="absolute left-0 right-0 bg-white rounded-xl z-50 border border-gray-100"
            style={{ top: 44, maxHeight: 420, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 }}
          >
            {!searchLoading && searchText.trim().length >= 2 && !searchResults?.product?.length && !searchResults?.user?.length ? (
              <View className="items-center py-7 px-4 gap-1.5">
                <Ionicons name="search-outline" size={28} color={Colors.gray.default} />
                <Text className="text-base font-mont-bold" style={{ color: '#1a1a1a' }}>Sin resultados</Text>
                <Text className="text-sm text-center font-mont-regular" style={{ color: Colors.gray.default }}>
                  No encontramos nada para "{searchText}"
                </Text>
              </View>
            ) : (
              <ScrollView keyboardShouldPersistTaps="handled" className="rounded-xl">
                {/* Productos */}
                {searchResults?.product && searchResults.product.length > 0 && (
                  <View>
                    <View className="flex-row items-center gap-1.5 px-3.5 py-2 bg-gray-50 border-b border-gray-100">
                      <Ionicons name="cube-outline" size={14} color={Colors.gray.default} />
                      <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.gray.default, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Productos
                      </Text>
                    </View>
                    {searchResults.product.map((product) => (
                      <TouchableOpacity
                        key={`product-${product.id}`}
                        onPress={() => handleProductPress(product.id)}
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
                {searchResults?.user && searchResults.user.length > 0 && (
                  <View>
                    <View className="flex-row items-center gap-1.5 px-3.5 py-2 bg-gray-50 border-b border-gray-100">
                      <Ionicons name="business-outline" size={14} color={Colors.gray.default} />
                      <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.gray.default, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Fabricantes
                      </Text>
                    </View>
                    {searchResults.user.map((manufacturer) => (
                      <TouchableOpacity
                        key={`manufacturer-${manufacturer.id}`}
                        onPress={() => handleManufacturerPress(manufacturer.id)}
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
                {searchText.trim() && (searchResults?.product?.length || searchResults?.user?.length) ? (
                  <TouchableOpacity onPress={handleSearchNavigation} className="flex-row items-center justify-center gap-1.5 py-3 border-t border-gray-100">
                    <Ionicons name="search" size={14} color={Colors.orange.dark} />
                    <Text className="text-sm font-semibold text-secondary">
                      Ver todos los resultados para "{searchText}"
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default Search;
