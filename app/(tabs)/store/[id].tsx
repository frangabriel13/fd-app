import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@/components/ui';
import { getManufacturerById, clearSelectedManufacturer } from '@/store/slices/manufacturerSlice';
import { clearStoreProducts } from '@/store/slices/productSlice';
import { RootState, AppDispatch } from '@/store';
import StoreProducts from '@/components/store/StoreProducts';

const StoreScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { loadingDetail, error } = useSelector((state: RootState) => state.manufacturer);

  useEffect(() => {
    const numericId = Number(id);
    if (id && !isNaN(numericId)) {
      dispatch(getManufacturerById(numericId));
    }
    return () => {
      dispatch(clearSelectedManufacturer());
      dispatch(clearStoreProducts());
    };
  }, [id, dispatch]);

  if (loadingDetail) {
    return (
      <Container type="page">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cargando...</Text>
        </View>
      </Container>
    );
  }

  if (error) {
    return (
      <Container type="page">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', textAlign: 'center', paddingHorizontal: 20 }}>
            No se pudo cargar la tienda. Intentá de nuevo más tarde.
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StoreProducts />
    </View>
  );
};


export default StoreScreen;