import { useRef, useState, useEffect, useCallback } from 'react';
import { TextInput } from 'react-native';
import { router } from 'expo-router';
import { fetchSearchResults, clearSearchResults } from '@/store/slices/productSlice';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';

const MAX_RESULTS_PER_SECTION = 5;

interface UseSearchProps {
  onExpandChange: (expanded: boolean) => void;
}

const useSearch = ({ onExpandChange }: UseSearchProps) => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dispatch = useAppDispatch();

  const { searchResults, searchLoading } = useAppSelector((state) => state.product);

  // Limpia el timeout del blur al desmontar para evitar setState en componente desmontado
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

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

  const resetSearch = useCallback(() => {
    setSearchText('');
    setShowResults(false);
    dispatch(clearSearchResults());
    textInputRef.current?.blur();
    onExpandChange(false);
  }, [dispatch, onExpandChange]);

  const handleCancel = useCallback(() => resetSearch(), [resetSearch]);

  const handleFocus = useCallback(() => {
    onExpandChange(true);
  }, [onExpandChange]);

  const handleBlur = useCallback(() => {
    // Se necesita el delay para que el onPress de los resultados se ejecute
    // antes de que el blur oculte la lista. Sin esto, tocar un resultado
    // cierra el dropdown antes de que el press sea registrado.
    blurTimeoutRef.current = setTimeout(() => {
      if (searchText === '') {
        onExpandChange(false);
      }
      setShowResults(false);
    }, 150);
  }, [searchText, onExpandChange]);

  const handleSearchNavigation = useCallback(() => {
    // searchTerm se captura antes del reset para que no se pierda al limpiar el estado
    const searchTerm = searchText.trim();
    if (searchTerm) {
      resetSearch();
      router.push({ pathname: '/(tabs)/tienda', params: { searchTerm } });
    }
  }, [searchText, resetSearch]);

  const handleProductPress = useCallback((productId: string) => {
    resetSearch();
    router.push({ pathname: '/(tabs)/producto/[id]', params: { id: productId } });
  }, [resetSearch]);

  const handleManufacturerPress = useCallback((userId: string) => {
    resetSearch();
    router.push({ pathname: '/(tabs)/store/[id]', params: { id: userId } });
  }, [resetSearch]);

  const products = searchResults?.product?.slice(0, MAX_RESULTS_PER_SECTION) ?? [];
  const manufacturers = searchResults?.user?.slice(0, MAX_RESULTS_PER_SECTION) ?? [];
  const hasResults = products.length > 0 || manufacturers.length > 0;
  const showEmpty = !searchLoading && searchText.trim().length >= 2 && !hasResults;

  return {
    searchText,
    setSearchText,
    showResults,
    searchLoading,
    textInputRef,
    products,
    manufacturers,
    hasResults,
    showEmpty,
    handleCancel,
    handleFocus,
    handleBlur,
    handleSearchNavigation,
    handleProductPress,
    handleManufacturerPress,
  };
};

export default useSearch;
