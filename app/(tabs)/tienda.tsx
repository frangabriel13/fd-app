import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppDispatch, RootState } from '@/store';
import { fetchShopProducts, setShopFilters } from '@/store/slices/productSlice';
import { Colors } from '@/constants/Colors';
import MenuGender from '@/components/shop/MenuGender';
import SelectCategory from '@/components/shop/SelectCategory';
import ProductCard from '@/components/shop/ProductCard';

const ShopScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchTerm } = useLocalSearchParams<{ searchTerm?: string }>();
  const { shopProducts, shopPagination, shopFilters, searchInfo, loading, error } = useSelector((state: RootState) => state.product);
  
  // Debug: Verificar el estado inicial
  useEffect(() => {
    // console.log('🔍 Estado inicial del Redux:', {
    //   shopProducts,
    //   shopPagination,
    //   shopFilters,
    //   loading,
    //   error
    // });
  }, []);
  
  const [selectedGender, setSelectedGender] = useState<number | null>(null); // Sin género seleccionado inicialmente
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);

  // Resetear filtros cada vez que se entra a la tienda
  useFocusEffect(
    React.useCallback(() => {
      // console.log('🔄 Reseteando filtros al entrar a tienda');
      setSelectedGender(null);
      setSelectedCategory(undefined);
      
      // Resetear filtros en Redux
      dispatch(setShopFilters({ genderId: null, categoryId: null }));
      
      // Cargar productos sin filtros
      const params = {
        page: 1,
        limit: 16,
        append: false,
        ...(searchTerm && { searchTerm }) // Incluir searchTerm si existe
      };
      
      dispatch(fetchShopProducts(params));
    }, [dispatch, searchTerm])
  );

  // Llamada inicial al cargar el componente (solo para cambios de selectedGender después del focus)
  useEffect(() => {
    // Solo hacer llamada si hay un género seleccionado (esto evita doble llamada con useFocusEffect)
    if (selectedGender) {
      // console.log('🚀 Cargando productos para género seleccionado:', selectedGender);
      const params = {
        genderId: selectedGender,
        page: 1,
        limit: 16,
        append: false,
        ...(searchTerm && { searchTerm }) // Incluir searchTerm si existe
      };
      
      dispatch(fetchShopProducts(params));
    }
  }, [dispatch, selectedGender, searchTerm]);

  // Escuchar cambios en el estado del Redux para hacer console.log
  useEffect(() => {
    if (shopProducts && shopProducts.length > 0) {
      // console.log('✅ Productos cargados:', shopProducts);
      // console.log('📄 Paginación:', shopPagination);
      // console.log('🔍 Filtros aplicados:', shopFilters);
      // console.log('🔎 Info de búsqueda:', searchInfo);
    }
  }, [shopProducts, shopPagination, shopFilters, searchInfo]);

  useEffect(() => {
    if (loading) {
      // console.log('⏳ Cargando productos...');
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      // console.log('❌ Error al cargar productos:', error);
    }
  }, [error]);

  const handleGenderChange = (genderId: number) => {
    // Si el género ya está seleccionado, deseleccionarlo
    const newGenderId = selectedGender === genderId ? null : genderId;
    
    // console.log('👤 Cambiando género a:', newGenderId);
    setSelectedGender(newGenderId);
    setSelectedCategory(undefined); // Reset category when gender changes
    
    // Actualizar filtros en Redux
    dispatch(setShopFilters({ genderId: newGenderId, categoryId: null }));
    
    // Hacer nueva llamada con el género seleccionado (reemplazar productos, no agregar)
    const params = {
      ...(newGenderId && { genderId: newGenderId }), // Solo incluir genderId si no es null
      page: 1,
      limit: 16,
      append: false,
      ...(searchTerm && { searchTerm }) // Mantener searchTerm si existe
    };
    
    dispatch(fetchShopProducts(params));
  };

  const handleCategoryChange = (categoryId: number) => {
    // console.log('🏷️ Cambiando categoría a:', categoryId);
    setSelectedCategory(categoryId);
    
    // Actualizar filtros en Redux
    dispatch(setShopFilters({ genderId: selectedGender, categoryId }));
    
    // Hacer nueva llamada con la categoría seleccionada (reemplazar productos, no agregar)
    const params = {
      ...(selectedGender && { genderId: selectedGender }), // Solo incluir genderId si no es null
      categoryId,
      page: 1,
      limit: 16,
      append: false,
      ...(searchTerm && { searchTerm }) // Mantener searchTerm si existe
    };
    
    dispatch(fetchShopProducts(params));
  };

  const loadMoreProducts = () => {
    if (loadingMore || loading) return;
    
    const currentPage = shopPagination?.currentPage || 1;
    const totalPages = shopPagination?.totalPages || 1;
    
    if (currentPage >= totalPages) {
      // console.log('📄 No hay más páginas para cargar');
      return;
    }
    
    const nextPage = currentPage + 1;
    // console.log('📄 Cargando página:', nextPage);
    
    setLoadingMore(true);
    
    const params = {
      ...(selectedGender && { genderId: selectedGender }), // Solo incluir genderId si no es null
      ...(selectedCategory && { categoryId: selectedCategory }),
      page: nextPage,
      limit: 16,
      append: true, // Agregar productos en lugar de reemplazarlos
      ...(searchTerm && { searchTerm }) // Mantener searchTerm si existe
    };
    
    dispatch(fetchShopProducts(params)).finally(() => {
      setLoadingMore(false);
    });
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.blue.default} />
        <Text style={styles.footerText}>Cargando más productos...</Text>
      </View>
    );
  };

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard product={item} />
  );

  const renderLoadingProducts = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.blue.default} />
      <Text style={styles.loadingText}>Cargando productos...</Text>
    </View>
  );

  const renderEmptyProducts = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No se encontraron productos</Text>
      <Text style={styles.emptySubText}>Prueba cambiando los filtros</Text>
    </View>
  );

  const renderProductGrid = () => {
    if (loading && (!shopProducts || shopProducts.length === 0)) {
      return renderLoadingProducts();
    }

    if (!loading && (!shopProducts || shopProducts.length === 0)) {
      return renderEmptyProducts();
    }

    return (
      <FlatList
        data={shopProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => `product-${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MenuGender 
        selectedGender={selectedGender}
        onGenderSelect={handleGenderChange} 
      />
      {selectedGender && (
        <SelectCategory 
          selectedGenderId={selectedGender} 
          onCategorySelect={handleCategoryChange}
        />
      )}
      
      {/* Información de búsqueda */}
      {searchTerm && (
        <View style={styles.searchInfo}>
          <Text style={styles.searchTitle}>
            Resultados para "{searchTerm}"
          </Text>
          <TouchableOpacity 
            style={styles.clearSearchButton}
            onPress={() => {
              router.replace('/(tabs)/tienda');
            }}
          >
            <Ionicons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Información de resultados */}
      {shopPagination && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {shopPagination.totalProducts} productos encontrados
          </Text>
          <Text style={styles.pageText}>
            Página {shopPagination.currentPage} de {shopPagination.totalPages}
          </Text>
        </View>
      )}

      {/* Grid de productos */}
      <View style={styles.productsWrapper}>
        {renderProductGrid()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInfo: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  clearSearchButton: {
    padding: 4,
    borderRadius: 4,
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  pageText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  productsWrapper: {
    flex: 1,
  },
  productsContainer: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  separator: {
    height: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.light.icon,
    textAlign: 'center',
  },
});


export default ShopScreen;