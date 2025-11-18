import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@/components/ui';
import { getManufacturerById } from '@/store/slices/manufacturerSlice';
import { RootState, AppDispatch } from '@/store';

const StoreScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedManufacturer, loadingDetail } = useSelector((state: RootState) => state.manufacturer);

  useEffect(() => {
    if (id) {
      console.log('🏪 Cargando fabricante con ID:', id);
      dispatch(getManufacturerById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedManufacturer) {
      console.log('✅ Datos del fabricante cargados:', selectedManufacturer);
    }
  }, [selectedManufacturer]);

  if (loadingDetail) {
    return (
      <Container type="page">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cargando...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container type="page">
      <View style={{ flex: 1, padding: 16 }}>
        <Text>tienda</Text>
      </View>
    </Container>
  );
};


export default StoreScreen;