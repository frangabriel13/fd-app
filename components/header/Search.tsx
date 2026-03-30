import { Ionicons } from '@expo/vector-icons';
import { useRef, useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchSearchResults, clearSearchResults } from '@/store/slices/productSlice';
import { Colors } from '@/constants/Colors';

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

  const handleSearchNavigation = () => {
    const searchTerm = searchText.trim();
    if (searchTerm) {
      setSearchText('');
      setShowResults(false);
      dispatch(clearSearchResults());
      textInputRef.current?.blur();
      onExpandChange(false);

      router.push({
        pathname: '/(tabs)/tienda',
        params: { searchTerm }
      });
    }
  };

  const handleProductPress = (productId: string) => {
    setShowResults(false);
    setSearchText('');
    dispatch(clearSearchResults());
    textInputRef.current?.blur();
    onExpandChange(false);
    router.push(`/(tabs)/producto/${productId}`);
  };

  const handleManufacturerPress = (userId: string) => {
    setShowResults(false);
    setSearchText('');
    dispatch(clearSearchResults());
    textInputRef.current?.blur();
    onExpandChange(false);
    router.push(`/(tabs)/store/${userId}`);
  };

  return (
    <>
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>

          {isExpanded ? (
            <TouchableOpacity onPress={handleCancel} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={20} color={Colors.gray.semiDark} />
            </TouchableOpacity>
          ) : (
            <Ionicons name="search" size={16} color={Colors.gray.default} style={styles.searchIcon} />
          )}
          <TextInput
            ref={textInputRef}
            placeholder="Buscar productos o fabricantes..."
            placeholderTextColor={Colors.gray.default}
            style={[styles.input, { color: '#1a1a1a' }]}
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
            <ActivityIndicator size="small" color={Colors.gray.semiDark} style={styles.loader} />
          )}
        </View>

        {/* Search results dropdown */}
        {showResults && isExpanded && (
        <View style={styles.resultsContainer}>
          {!searchLoading && searchText.trim().length >= 2 && !searchResults?.product?.length && !searchResults?.user?.length ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={28} color={Colors.gray.default} />
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptySubtitle}>No encontramos nada para "{searchText}"</Text>
            </View>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled" style={styles.resultsList}>
              {/* Products */}
              {searchResults?.product && searchResults.product.length > 0 && (
                <View>
                  <View style={styles.resultsSectionHeader}>
                    <Ionicons name="cube-outline" size={14} color={Colors.gray.default} />
                    <Text style={styles.resultsSectionTitle}>Productos</Text>
                  </View>
                  {searchResults.product.map((product) => (
                    <TouchableOpacity
                      key={`product-${product.id}`}
                      onPress={() => handleProductPress(product.id)}
                      style={styles.resultItem}
                    >
                      <Text style={styles.resultItemText} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Ionicons name="chevron-forward" size={14} color={Colors.gray.default} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Manufacturers */}
              {searchResults?.user && searchResults.user.length > 0 && (
                <View>
                  <View style={styles.resultsSectionHeader}>
                    <Ionicons name="business-outline" size={14} color={Colors.gray.default} />
                    <Text style={styles.resultsSectionTitle}>Fabricantes</Text>
                  </View>
                  {searchResults.user.map((manufacturer) => (
                    <TouchableOpacity
                      key={`manufacturer-${manufacturer.id}`}
                      onPress={() => handleManufacturerPress(manufacturer.id)}
                      style={styles.resultItem}
                    >
                      <Text style={styles.resultItemText} numberOfLines={1}>
                        {manufacturer.name}
                      </Text>
                      <Ionicons name="chevron-forward" size={14} color={Colors.gray.default} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* See all results */}
              {searchText.trim() && (searchResults?.product?.length || searchResults?.user?.length) ? (
                <TouchableOpacity onPress={handleSearchNavigation} style={styles.seeAllBtn}>
                  <Ionicons name="search" size={14} color={Colors.orange.dark} />
                  <Text style={styles.seeAllText}>
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

const styles = StyleSheet.create({
  searchWrapper: {
    flex: 1,
    zIndex: 50,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 2,
  },
  backBtn: {
    marginRight: 4,
    padding: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    color: '#fff',
    paddingVertical: 0,
    paddingHorizontal: 6,
    fontFamily: 'Montserrat-Regular',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  loader: {
    marginLeft: 4,
  },
  resultsContainer: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 50,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  resultsList: {
    borderRadius: 10,
  },
  resultsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultsSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray.default,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  resultItemText: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
    fontFamily: 'Montserrat-Regular',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.orange.dark,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'Montserrat-Bold',
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.gray.default,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
});

export default Search;
