import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppDispatch, RootState } from '@/store';
import { fetchShopProducts, setShopFilters } from '@/store/slices/productSlice';
import { Colors } from '@/constants/Colors';
import MenuGender from '@/components/shop/MenuGender';
import SelectCategory from '@/components/shop/SelectCategory';
import ProductCard from '@/components/shop/ProductCard';

// ─── Constantes ──────────────────────────────────────────────────────────────

const LIMIT = 16;

type SortValue = 'featured' | 'newest' | 'most-viewed' | 'price-high' | 'price-low' | 'onSale';

interface SortOptionConfig {
  value: SortValue;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

const SORT_OPTIONS: SortOptionConfig[] = [
  { value: 'featured',    label: 'Destacados',      icon: 'star-outline'     },
  { value: 'newest',      label: 'Nuevos ingresos', icon: 'time-outline'     },
  { value: 'most-viewed', label: 'Más vistos',       icon: 'eye-outline'      },
  { value: 'price-high',  label: 'Mayor precio',     icon: 'arrow-up'         },
  { value: 'price-low',   label: 'Menor precio',     icon: 'arrow-down'       },
  { value: 'onSale',      label: 'En oferta',        icon: 'pricetag-outline' },
];

const SORT_LABELS: Record<SortValue, string> = Object.fromEntries(
  SORT_OPTIONS.map((o) => [o.value, o.label])
) as Record<SortValue, string>;

// Extraído fuera del componente para evitar recreación en cada render
const ItemSeparator = () => <View style={styles.separator} />;

// ─── Componente ──────────────────────────────────────────────────────────────

const ShopScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchTerm, genderId, categoryId, sortBy } = useLocalSearchParams<{
    searchTerm?: string;
    genderId?: string;
    categoryId?: string;
    sortBy?: string;
  }>();
  const { shopProducts, shopPagination, shopFilters, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  // Sort derivado de Redux — una sola fuente de verdad
  const selectedSort: SortValue = (shopFilters.sortBy as SortValue) ?? 'featured';

  const [selectedGender, setSelectedGender] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const initialGenderId = genderId ? parseInt(genderId) : null;
      const initialCategoryId = categoryId ? parseInt(categoryId) : null;
      const initialSortBy: SortValue = (sortBy as SortValue) || 'featured';

      setSelectedGender(initialGenderId);
      setSelectedCategory(initialCategoryId);

      dispatch(setShopFilters({
        genderId: initialGenderId,
        categoryId: initialCategoryId,
        sortBy: initialSortBy,
      }));

      dispatch(fetchShopProducts({
        ...(initialGenderId && { genderId: initialGenderId }),
        ...(initialCategoryId && { categoryId: initialCategoryId }),
        sortBy: initialSortBy,
        page: 1,
        limit: LIMIT,
        append: false,
        ...(searchTerm && { searchTerm }),
      }));
    }, [dispatch, searchTerm, genderId, categoryId, sortBy])
  );

  const handleGenderChange = useCallback((newGenderId: number) => {
    const resolvedId = selectedGender === newGenderId ? null : newGenderId;
    setSelectedGender(resolvedId);
    setSelectedCategory(null);
    dispatch(setShopFilters({ genderId: resolvedId, categoryId: null }));
    dispatch(fetchShopProducts({
      ...(resolvedId && { genderId: resolvedId }),
      sortBy: selectedSort,
      page: 1,
      limit: LIMIT,
      append: false,
      ...(searchTerm && { searchTerm }),
    }));
  }, [dispatch, selectedGender, selectedSort, searchTerm]);

  const handleCategoryChange = useCallback((newCategoryId: number) => {
    setSelectedCategory(newCategoryId);
    dispatch(setShopFilters({ genderId: selectedGender, categoryId: newCategoryId }));
    dispatch(fetchShopProducts({
      ...(selectedGender && { genderId: selectedGender }),
      categoryId: newCategoryId,
      sortBy: selectedSort,
      page: 1,
      limit: LIMIT,
      append: false,
      ...(searchTerm && { searchTerm }),
    }));
  }, [dispatch, selectedGender, selectedSort, searchTerm]);

  const handleSortChange = useCallback((newSort: SortValue) => {
    dispatch(setShopFilters({ sortBy: newSort }));
    dispatch(fetchShopProducts({
      ...(selectedGender && { genderId: selectedGender }),
      ...(selectedCategory && { categoryId: selectedCategory }),
      sortBy: newSort,
      page: 1,
      limit: LIMIT,
      append: false,
      ...(searchTerm && { searchTerm }),
    }));
    setShowSortModal(false);
  }, [dispatch, selectedGender, selectedCategory, searchTerm]);

  const loadMoreProducts = useCallback(() => {
    if (loadingMore || loading) return;
    const currentPage = shopPagination?.currentPage ?? 1;
    const totalPages = shopPagination?.totalPages ?? 1;
    if (currentPage >= totalPages) return;

    setLoadingMore(true);
    dispatch(fetchShopProducts({
      ...(selectedGender && { genderId: selectedGender }),
      ...(selectedCategory && { categoryId: selectedCategory }),
      sortBy: selectedSort,
      page: currentPage + 1,
      limit: LIMIT,
      append: true,
      ...(searchTerm && { searchTerm }),
    })).finally(() => setLoadingMore(false));
  }, [dispatch, loadingMore, loading, shopPagination, selectedGender, selectedCategory, selectedSort, searchTerm]);

  const renderProduct = useCallback(
    ({ item }: { item: (typeof shopProducts)[0] }) => <ProductCard product={item} />,
    []
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.blue.default} />
        <Text style={styles.footerText}>Cargando más productos...</Text>
      </View>
    );
  }, [loadingMore]);

  const renderContent = () => {
    if (loading && shopProducts.length === 0) {
      return (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color={Colors.blue.default} />
          <Text style={styles.feedbackText}>Cargando productos...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.feedbackContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color={Colors.gray.default} />
          <Text style={styles.feedbackTitle}>Ocurrió un error</Text>
          <Text style={styles.feedbackText}>{error}</Text>
        </View>
      );
    }

    if (!loading && shopProducts.length === 0) {
      return (
        <View style={styles.feedbackContainer}>
          <Ionicons name="search-outline" size={48} color={Colors.gray.default} />
          <Text style={styles.feedbackTitle}>Sin resultados</Text>
          <Text style={styles.feedbackText}>Probá cambiando los filtros o el ordenamiento</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={shopProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparator}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    );
  };

  const isNonDefaultSort = selectedSort !== 'featured';

  return (
    <View style={styles.container}>
      <MenuGender selectedGender={selectedGender} onGenderSelect={handleGenderChange} />
      {selectedGender && (
        <SelectCategory
          selectedGenderId={selectedGender}
          selectedCategoryId={selectedCategory ?? undefined}
          onCategorySelect={handleCategoryChange}
        />
      )}

      {searchTerm && (
        <View style={styles.searchInfo}>
          <Text style={styles.searchTitle}>Resultados para "{searchTerm}"</Text>
          <Pressable style={styles.clearSearchButton} onPress={() => router.replace('/(tabs)/tienda')}>
            <Ionicons name="close" size={20} color={Colors.gray.semiDark} />
          </Pressable>
        </View>
      )}

      {shopPagination && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {shopPagination.totalProducts}{' '}
            {shopPagination.totalProducts === 1 ? 'resultado' : 'resultados'}
          </Text>
          <Pressable
            style={[styles.sortButton, isNonDefaultSort && styles.sortButtonActive]}
            onPress={() => setShowSortModal(true)}
          >
            <Text style={[styles.sortButtonText, isNonDefaultSort && styles.sortButtonTextActive]}>
              {SORT_LABELS[selectedSort]}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={isNonDefaultSort ? Colors.blue.dark : Colors.gray.dark}
            />
          </Pressable>
        </View>
      )}

      <View style={styles.productsWrapper}>{renderContent()}</View>

      {/* Modal de ordenamiento — desliza desde abajo */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowSortModal(false)}>
          {/* Pressable interno vacío para evitar que el tap en el contenido cierre el modal */}
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ordenar por</Text>
              <Pressable onPress={() => setShowSortModal(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </Pressable>
            </View>
            {SORT_OPTIONS.map((option) => {
              const isActive = selectedSort === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.sortOption, isActive && styles.sortOptionActive]}
                  onPress={() => handleSortChange(option.value)}
                >
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color={isActive ? Colors.blue.dark : Colors.light.icon}
                  />
                  <Text style={[styles.sortOptionText, isActive && styles.sortOptionTextActive]}>
                    {option.label}
                  </Text>
                  {isActive && <Ionicons name="checkmark" size={20} color={Colors.blue.dark} />}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
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
    backgroundColor: Colors.gray.light,
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
    borderColor: Colors.gray.dark,
  },
  sortButtonActive: {
    borderColor: Colors.blue.dark,
    backgroundColor: '#eef2ff',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray.dark,
  },
  sortButtonTextActive: {
    color: Colors.blue.dark,
  },
  productsWrapper: {
    flex: 1,
  },
  productsContainer: {
    paddingVertical: 8,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 10,
  },
  separator: {
    height: 10,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: 'center',
    paddingHorizontal: 32,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray.default,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
    backgroundColor: Colors.gray.light,
  },
  sortOptionActive: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: Colors.blue.dark,
  },
  sortOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.light.text,
  },
  sortOptionTextActive: {
    color: Colors.blue.dark,
    fontWeight: '600',
  },
});

export default ShopScreen;
