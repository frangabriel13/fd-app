import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
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
  const { searchTerm, genderId, categoryId, sortBy } = useLocalSearchParams<{ searchTerm?: string; genderId?: string; categoryId?: string; sortBy?: string }>();
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
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [showSortModal, setShowSortModal] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Configurar género inicial desde parámetros o resetear
  useFocusEffect(
    React.useCallback(() => {
      // Si viene un genderId desde los parámetros, establecerlo
      const initialGenderId = genderId ? parseInt(genderId) : null;
      const initialCategoryId = categoryId ? parseInt(categoryId) : undefined;
      const initialSortBy = sortBy || 'featured';
      
      setSelectedGender(initialGenderId);
      setSelectedCategory(initialCategoryId);
      setSelectedSort(initialSortBy);
      
      // Actualizar filtros en Redux
      dispatch(setShopFilters({ genderId: initialGenderId, categoryId: initialCategoryId || null, sortBy: initialSortBy }));
      
      // Cargar productos con los parámetros
      const params = {
        ...(initialGenderId && { genderId: initialGenderId }),
        ...(initialCategoryId && { categoryId: initialCategoryId }),
        sortBy: initialSortBy,
        page: 1,
        limit: 16,
        append: false,
        ...(searchTerm && { searchTerm })
      };
      
      dispatch(fetchShopProducts(params));
    }, [dispatch, searchTerm, genderId, categoryId, sortBy])
  );

  // Llamada inicial al cargar el componente (solo para cambios de selectedGender/selectedSort/selectedCategory después del focus)
  useEffect(() => {
    // Solo hacer llamada si hay un género seleccionado (esto evita doble llamada con useFocusEffect)
    if (selectedGender) {
      // console.log('🚀 Cargando productos para género seleccionado:', selectedGender);
      const params = {
        genderId: selectedGender,
        ...(selectedCategory && { categoryId: selectedCategory }),
        sortBy: selectedSort,
        page: 1,
        limit: 16,
        append: false,
        ...(searchTerm && { searchTerm }) // Incluir searchTerm si existe
      };
      
      dispatch(fetchShopProducts(params));
    }
  }, [dispatch, selectedGender, selectedCategory, selectedSort, searchTerm]);

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
      sortBy: selectedSort,
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
      sortBy: selectedSort,
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
      sortBy: selectedSort,
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
          selectedCategoryId={selectedCategory}
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
      
      {/* Información de resultados y ordenamiento */}
      {shopPagination && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {shopPagination.totalProducts} {shopPagination.totalProducts === 1 ? 'resultado' : 'resultados'}
          </Text>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            {/* <Ionicons name="stats-chart" size={16} color={Colors.blue.default} /> */}
            <Text style={styles.sortButtonText}>
              Ordenar por: {selectedSort === 'newest' ? 'Nuevos' : selectedSort === 'onSale' ? 'Ofertas' : selectedSort === 'featured' ? 'Destacados' : selectedSort === 'price-high' ? 'Mayor precio' : selectedSort === 'most-viewed' ? 'Más vistos' : 'Menor precio'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#1f2937" />
          </TouchableOpacity>
        </View>
      )}

      {/* Grid de productos */}
      <View style={styles.productsWrapper}>
        {renderProductGrid()}
      </View>

      {/* Modal de ordenamiento */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ordenar por</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.sortOption, selectedSort === 'featured' && styles.sortOptionActive]}
              onPress={() => {
                setSelectedSort('featured');
                dispatch(setShopFilters({ sortBy: 'featured' }));
                const params = {
                  ...(selectedGender && { genderId: selectedGender }),
                  ...(selectedCategory && { categoryId: selectedCategory }),
                  sortBy: 'featured',
                  page: 1,
                  limit: 16,
                  append: false,
                  ...(searchTerm && { searchTerm })
                };
                dispatch(fetchShopProducts(params));
                setShowSortModal(false);
              }}
            >
              <Ionicons
                name="star-outline"
                size={20}
                color={selectedSort === 'featured' ? '#1f2937' : Colors.light.icon}
              />
              <Text style={[styles.sortOptionText, selectedSort === 'featured' && styles.sortOptionTextActive]}>
                Destacados
              </Text>
              {selectedSort === 'featured' && (
                <Ionicons name="checkmark" size={20} color="#1f2937" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOption, selectedSort === 'newest' && styles.sortOptionActive]}
              onPress={() => {
                setSelectedSort('newest');
                dispatch(setShopFilters({ sortBy: 'newest' }));
                const params = {
                  ...(selectedGender && { genderId: selectedGender }),
                  ...(selectedCategory && { categoryId: selectedCategory }),
                  sortBy: 'newest',
                  page: 1,
                  limit: 16,
                  append: false,
                  ...(searchTerm && { searchTerm })
                };
                dispatch(fetchShopProducts(params));
                setShowSortModal(false);
              }}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={selectedSort === 'newest' ? '#1f2937' : Colors.light.icon}
              />
              <Text style={[styles.sortOptionText, selectedSort === 'newest' && styles.sortOptionTextActive]}>
                Nuevos ingresos
              </Text>
              {selectedSort === 'newest' && (
                <Ionicons name="checkmark" size={20} color="#1f2937" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOption, selectedSort === 'most-viewed' && styles.sortOptionActive]}
              onPress={() => {
                setSelectedSort('most-viewed');
                dispatch(setShopFilters({ sortBy: 'most-viewed' }));
                const params = {
                  ...(selectedGender && { genderId: selectedGender }),
                  ...(selectedCategory && { categoryId: selectedCategory }),
                  sortBy: 'most-viewed',
                  page: 1,
                  limit: 16,
                  append: false,
                  ...(searchTerm && { searchTerm })
                };
                dispatch(fetchShopProducts(params));
                setShowSortModal(false);
              }}
            >
              <Ionicons
                name="eye-outline"
                size={20}
                color={selectedSort === 'most-viewed' ? '#1f2937' : Colors.light.icon}
              />
              <Text style={[styles.sortOptionText, selectedSort === 'most-viewed' && styles.sortOptionTextActive]}>
                Más vistos
              </Text>
              {selectedSort === 'most-viewed' && (
                <Ionicons name="checkmark" size={20} color="#1f2937" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOption, selectedSort === 'price-high' && styles.sortOptionActive]}
              onPress={() => {
                setSelectedSort('price-high');
                dispatch(setShopFilters({ sortBy: 'price-high' }));
                const params = {
                  ...(selectedGender && { genderId: selectedGender }),
                  ...(selectedCategory && { categoryId: selectedCategory }),
                  sortBy: 'price-high',
                  page: 1,
                  limit: 16,
                  append: false,
                  ...(searchTerm && { searchTerm })
                };
                dispatch(fetchShopProducts(params));
                setShowSortModal(false);
              }}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={selectedSort === 'price-high' ? '#1f2937' : Colors.light.icon}
              />
              <Text style={[styles.sortOptionText, selectedSort === 'price-high' && styles.sortOptionTextActive]}>
                Mayor precio
              </Text>
              {selectedSort === 'price-high' && (
                <Ionicons name="checkmark" size={20} color="#1f2937" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOption, selectedSort === 'price-low' && styles.sortOptionActive]}
              onPress={() => {
                setSelectedSort('price-low');
                dispatch(setShopFilters({ sortBy: 'price-low' }));
                const params = {
                  ...(selectedGender && { genderId: selectedGender }),
                  ...(selectedCategory && { categoryId: selectedCategory }),
                  sortBy: 'price-low',
                  page: 1,
                  limit: 16,
                  append: false,
                  ...(searchTerm && { searchTerm })
                };
                dispatch(fetchShopProducts(params));
                setShowSortModal(false);
              }}
            >
              <Ionicons
                name="arrow-down"
                size={20}
                color={selectedSort === 'price-low' ? '#1f2937' : Colors.light.icon}
              />
              <Text style={[styles.sortOptionText, selectedSort === 'price-low' && styles.sortOptionTextActive]}>
                Menor precio
              </Text>
              {selectedSort === 'price-low' && (
                <Ionicons name="checkmark" size={20} color="#1f2937" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOption, selectedSort === 'onSale' && styles.sortOptionActive]}
              onPress={() => {
                setSelectedSort('onSale');
                dispatch(setShopFilters({ sortBy: 'onSale' }));
                const params = {
                  ...(selectedGender && { genderId: selectedGender }),
                  ...(selectedCategory && { categoryId: selectedCategory }),
                  sortBy: 'onSale',
                  page: 1,
                  limit: 16,
                  append: false,
                  ...(searchTerm && { searchTerm })
                };
                dispatch(fetchShopProducts(params));
                setShowSortModal(false);
              }}
            >
              <Ionicons
                name="eye-outline"
                size={20}
                color={selectedSort === 'most-viewed' ? '#1f2937' : Colors.light.icon}
              />
              <Text style={[styles.sortOptionText, selectedSort === 'most-viewed' && styles.sortOptionTextActive]}>
                Más vistos
              </Text>
              {selectedSort === 'most-viewed' && (
                <Ionicons name="checkmark" size={20} color="#1f2937" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
    backgroundColor: '#f8f9fa',
  },
  sortOptionActive: {
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  sortOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.light.text,
  },
  sortOptionTextActive: {
    color: '#1f2937',
    fontWeight: '600',
  },
  productsWrapper: {
    flex: 1,
  },
  productsContainer: {
    padding: 8,
  },
  row: {
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    gap: 10,
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