import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchShopProducts, setShopFilters } from '@/store/slices/productSlice';
import MenuGender from '@/components/shop/MenuGender';
import SelectCategory from '@/components/shop/SelectCategory';

const ShopScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { shopProducts, shopPagination, shopFilters, loading, error } = useSelector((state: RootState) => state.product);
  
  // Debug: Verificar el estado inicial
  useEffect(() => {
    console.log('🔍 Estado inicial del Redux:', {
      shopProducts,
      shopPagination,
      shopFilters,
      loading,
      error
    });
  }, []);
  
  const [selectedGender, setSelectedGender] = useState<number>(3); // Mujer por defecto

  // Llamada inicial al cargar el componente
  useEffect(() => {
    console.log('🚀 Cargando productos iniciales para género:', selectedGender);
    dispatch(fetchShopProducts({ 
      genderId: selectedGender,
      page: 1,
      limit: 10 
    }));
  }, [dispatch, selectedGender]);

  // Escuchar cambios en el estado del Redux para hacer console.log
  useEffect(() => {
    if (shopProducts && shopProducts.length > 0) {
      console.log('✅ Productos cargados:', shopProducts);
      console.log('📄 Paginación:', shopPagination);
      console.log('🔍 Filtros aplicados:', shopFilters);
    }
  }, [shopProducts, shopPagination, shopFilters]);

  useEffect(() => {
    if (loading) {
      console.log('⏳ Cargando productos...');
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      console.log('❌ Error al cargar productos:', error);
    }
  }, [error]);

  const handleGenderChange = (genderId: number) => {
    console.log('👤 Cambiando género a:', genderId);
    setSelectedGender(genderId);
    
    // Actualizar filtros en Redux
    dispatch(setShopFilters({ genderId }));
    
    // Hacer nueva llamada con el género seleccionado
    dispatch(fetchShopProducts({ 
      genderId,
      page: 1,
      limit: 10 
    }));
  };

  return (
    <View style={styles.container}>
      <MenuGender onGenderSelect={handleGenderChange} />
      <SelectCategory selectedGenderId={selectedGender} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});


export default ShopScreen;