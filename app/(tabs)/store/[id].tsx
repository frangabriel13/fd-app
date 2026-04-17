import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getManufacturerById, clearSelectedManufacturer } from '@/store/slices/manufacturerSlice';
import { clearStoreProducts } from '@/store/slices/productSlice';
import { RootState, AppDispatch } from '@/store';
import StoreProducts from '@/components/store/StoreProducts';
import { manufacturerInstance } from '@/services/axiosConfig';

const StoreScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { loadingDetail, error } = useSelector((state: RootState) => state.manufacturer);

  useEffect(() => {
    const numericId = Number(id);
    if (id && !isNaN(numericId)) {
      dispatch(getManufacturerById(numericId));
      manufacturerInstance.post(`/${numericId}/view`).catch(() => {});
    }
    return () => {
      dispatch(clearSelectedManufacturer());
      dispatch(clearStoreProducts());
    };
  }, [id, dispatch]);

  if (loadingDetail) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', textAlign: 'center' }}>
            No se pudo cargar la tienda. Intentá de nuevo más tarde.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StoreProducts />
    </View>
  );
};


export default StoreScreen;