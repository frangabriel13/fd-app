import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { 
  getSizes, 
  clearError, 
  resetSizes,
  selectSizes,
  selectSizesLoading,
  selectSizesError 
} from '@/store/slices/sizeSlice';

export const useSizes = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const sizes = useSelector((state: RootState) => selectSizes(state));
  const loading = useSelector((state: RootState) => selectSizesLoading(state));
  const error = useSelector((state: RootState) => selectSizesError(state));

  // Actions
  const fetchSizes = () => {
    dispatch(getSizes());
  };

  const clearSizesError = () => {
    dispatch(clearError());
  };

  const resetSizesState = () => {
    dispatch(resetSizes());
  };

  return {
    // State
    sizes,
    loading,
    error,
    
    // Actions
    fetchSizes,
    clearSizesError,
    resetSizesState,
  };
};