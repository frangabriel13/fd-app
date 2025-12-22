import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchShopProducts, setShopFilters } from '@/store/slices/productSlice';
import { Colors } from '@/constants/Colors';
import MenuGender from '@/components/shop/MenuGender';
import SelectCategory from '@/components/shop/SelectCategory';
import ProductCard from '@/components/shop/ProductCard';

const ShopScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { shopProducts, shopPagination, shopFilters, loading, error } = useSelector((state: RootState) => state.product);
  
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
  
  const [selectedGender, setSelectedGender] = useState<number>(3); // Mujer por defecto
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);

  // Llamada inicial al cargar el componente
  useEffect(() => {
    // console.log('🚀 Cargando productos iniciales para género:', selectedGender);
    dispatch(fetchShopProducts({ 
      genderId: selectedGender,
      page: 1,
      limit: 16,
      append: false
    }));
  }, [dispatch, selectedGender]);

  // Escuchar cambios en el estado del Redux para hacer console.log
  useEffect(() => {
    if (shopProducts && shopProducts.length > 0) {
      // console.log('✅ Productos cargados:', shopProducts);
      // console.log('📄 Paginación:', shopPagination);
      // console.log('🔍 Filtros aplicados:', shopFilters);
    }
  }, [shopProducts, shopPagination, shopFilters]);

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
    // console.log('👤 Cambiando género a:', genderId);
    setSelectedGender(genderId);
    setSelectedCategory(undefined); // Reset category when gender changes
    
    // Actualizar filtros en Redux
    dispatch(setShopFilters({ genderId, categoryId: null }));
    
    // Hacer nueva llamada con el género seleccionado (reemplazar productos, no agregar)
    dispatch(fetchShopProducts({ 
      genderId,
      page: 1,
      limit: 16,
      append: false
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    // console.log('🏷️ Cambiando categoría a:', categoryId);
    setSelectedCategory(categoryId);
    
    // Actualizar filtros en Redux
    dispatch(setShopFilters({ genderId: selectedGender, categoryId }));
    
    // Hacer nueva llamada con la categoría seleccionada (reemplazar productos, no agregar)
    dispatch(fetchShopProducts({ 
      genderId: selectedGender,
      categoryId,
      page: 1,
      limit: 16,
      append: false
    }));
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
    
    dispatch(fetchShopProducts({ 
      genderId: selectedGender,
      categoryId: selectedCategory,
      page: nextPage,
      limit: 16,
      append: true // Agregar productos en lugar de reemplazarlos
    })).finally(() => {
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
      <MenuGender onGenderSelect={handleGenderChange} />
      <SelectCategory 
        selectedGenderId={selectedGender} 
        onCategorySelect={handleCategoryChange}
      />
      
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