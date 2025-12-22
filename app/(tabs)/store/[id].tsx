import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@/components/ui';
import { getManufacturerById } from '@/store/slices/manufacturerSlice';
import { RootState, AppDispatch } from '@/store';
import HeaderProfile from '@/components/store/HeaderProfile';
import Reviews from '@/components/store/Reviews';
import StoreProducts from '@/components/store/StoreProducts';

const StoreScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedManufacturer, loadingDetail } = useSelector((state: RootState) => state.manufacturer);

  useEffect(() => {
    if(id) {
      // console.log('🏪 Cargando fabricante con ID:', selectedManufacturer?.user.id);
      dispatch(getManufacturerById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedManufacturer) {
      // console.log('✅ Datos del fabricante cargados:', selectedManufacturer?.user.id);
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
    <ScrollView style={{ flex: 1 }}>
      <HeaderProfile />
      <Reviews />
      <StoreProducts />
    </ScrollView>
  );
};


export default StoreScreen;