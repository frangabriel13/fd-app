import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { RootState, AppDispatch } from '@/store';
import { fetchShopProducts, setShopFilters } from '@/store/slices/productSlice';
import { SHOP_LIMIT, SortValue } from '@/constants/shop';

export const useShop = () => {
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
        limit: SHOP_LIMIT,
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
      limit: SHOP_LIMIT,
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
      limit: SHOP_LIMIT,
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
      limit: SHOP_LIMIT,
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
      limit: SHOP_LIMIT,
      append: true,
      ...(searchTerm && { searchTerm }),
    })).finally(() => setLoadingMore(false));
  }, [dispatch, loadingMore, loading, shopPagination, selectedGender, selectedCategory, selectedSort, searchTerm]);

  return {
    shopProducts,
    shopPagination,
    loading,
    error,
    selectedSort,
    searchTerm,
    selectedGender,
    selectedCategory,
    showSortModal,
    loadingMore,
    setShowSortModal,
    handleGenderChange,
    handleCategoryChange,
    handleSortChange,
    loadMoreProducts,
  };
};
