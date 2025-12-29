import { Ionicons } from '@expo/vector-icons';
import { useRef, useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchSearchResults, clearSearchResults } from '@/store/slices/productSlice';

interface SearchProps {
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

const Search = ({ isExpanded, onExpandChange }: SearchProps) => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const dispatch = useDispatch<AppDispatch>();
  
  const { searchResults, searchLoading } = useSelector((state: RootState) => state.product);

  // Debounce para búsqueda en tiempo real
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

  const handleFocus = () => {
    onExpandChange(true);
  };

  const handleBlur = () => {
    // Delay para permitir tocar los resultados antes de cerrar
    setTimeout(() => {
      if (searchText === '') {
        onExpandChange(false);
      }
      setShowResults(false);
    }, 150);
  };

  const handleCancel = () => {
    setSearchText('');
    setShowResults(false);
    dispatch(clearSearchResults());
    textInputRef.current?.blur();
    onExpandChange(false);
  };

  const handleProductPress = (productId: string, productName: string) => {
    setShowResults(false);
    textInputRef.current?.blur();
    router.push(`/(tabs)/producto/${productId}`);
  };

  const handleManufacturerPress = (userId: string, manufacturerName: string) => {
    setShowResults(false);
    textInputRef.current?.blur();
    router.push(`/(tabs)/store/${userId}`);
  };

  return (
    <>
      <View className={`flex-row items-center ${isExpanded ? 'flex-1' : 'flex-1 mx-4'}`}>
        <View className="flex-1 flex-row items-center bg-gray-100 rounded px-0 py-0">
          {isExpanded && (
            <TouchableOpacity 
              onPress={handleCancel}
              className="ml-2 mr-1 p-1"
            >
              <Ionicons name="arrow-back" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
          <TextInput
            ref={textInputRef}
            placeholder="Buscar productos o fabricantes..."
            placeholderTextColor="#9ca3af"
            className={`flex-1 font-mont-regular text-primary ${isExpanded ? 'ml-1' : 'ml-2'}`}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (searchText.trim()) {
                console.log('Buscar:', searchText);
                setShowResults(false);
                router.push({
                  pathname: '/(tabs)/tienda',
                  params: { searchTerm: searchText.trim() }
                });
              }
            }}
          />
          {searchLoading && (
            <View className="mr-2">
              <ActivityIndicator size="small" color="#6b7280" />
            </View>
          )}
        </View>
      </View>

      {/* Resultados de búsqueda */}
      {showResults && isExpanded && (searchResults?.product.length || searchResults?.user.length) && (
        <View className="absolute top-16 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 mt-1 max-h-80 z-50 mx-4">
          <ScrollView keyboardShouldPersistTaps="handled">
            {/* Productos */}
            {searchResults?.product && searchResults.product.length > 0 && (
              <View>
                <View className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <Text className="font-mont-semibold text-xs text-gray-600 uppercase">
                    Productos
                  </Text>
                </View>
                {searchResults.product.map((product) => (
                  <TouchableOpacity
                    key={`product-${product.id}`}
                    onPress={() => handleProductPress(product.id, product.name)}
                    className="px-4 py-3 border-b border-gray-100 flex-row items-center"
                  >
                    <Ionicons name="cube-outline" size={16} color="#6b7280" />
                    <Text className="ml-3 font-mont-regular text-primary flex-1" numberOfLines={1}>
                      {product.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Fabricantes */}
            {searchResults?.user && searchResults.user.length > 0 && (
              <View>
                <View className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <Text className="font-mont-semibold text-xs text-gray-600 uppercase">
                    Fabricantes
                  </Text>
                </View>
                {searchResults.user.map((manufacturer) => (
                  <TouchableOpacity
                    key={`manufacturer-${manufacturer.id}`}
                    onPress={() => handleManufacturerPress(manufacturer.userId, manufacturer.name)}
                    className="px-4 py-3 border-b border-gray-100 flex-row items-center"
                  >
                    <Ionicons name="business-outline" size={16} color="#6b7280" />
                    <Text className="ml-3 font-mont-regular text-primary flex-1" numberOfLines={1}>
                      {manufacturer.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Opción para ver todos los resultados */}
            {searchText.trim() && (
              <TouchableOpacity
                onPress={() => {
                  setShowResults(false);
                  router.push({
                    pathname: '/(tabs)/tienda',
                    params: { searchTerm: searchText.trim() }
                  });
                }}
                className="px-4 py-3 bg-blue-50 border-t border-gray-200"
              >
                <Text className="font-mont-medium text-blue-600 text-center">
                  Ver todos los resultados para "{searchText}"
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
};


export default Search;