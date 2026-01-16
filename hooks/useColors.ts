import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { 
  getColors, 
  clearError, 
  resetColors,
  selectColors,
  selectColorsLoading,
  selectColorsError 
} from '@/store/slices/colorSlice';

export const useColors = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const colors = useSelector((state: RootState) => selectColors(state));
  const loading = useSelector((state: RootState) => selectColorsLoading(state));
  const error = useSelector((state: RootState) => selectColorsError(state));

  // Actions
  const fetchColors = () => {
    dispatch(getColors());
  };

  const clearColorsError = () => {
    dispatch(clearError());
  };

  const resetColorsState = () => {
    dispatch(resetColors());
  };

  return {
    // State
    colors,
    loading,
    error,
    
    // Actions
    fetchColors,
    clearColorsError,
    resetColorsState,
  };
};