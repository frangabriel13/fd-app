import Slider from '@/components/slider/Slider';
import Genders from '@/components/home/Genders';
import LiveManufacturers from '@/components/home/LiveManufacturers';
import ProductSlider from '@/components/home/ProductSlider';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useEffect, useRef, useCallback } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import { useDispatch } from 'react-redux';
import { fetchMobileHomeProducts } from '@/store/slices/productSlice';
import type { AppDispatch } from '@/store';
import Info from '@/components/home/Info';

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  useEffect(() => {
    dispatch(fetchMobileHomeProducts());
  }, [dispatch]);

  return (
    <ScrollView ref={scrollRef} style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
      <Slider />
      <View style={styles.homeContent}>
        <Genders />
        <LiveManufacturers />
        <ProductSlider title="Productos Destacados" section="featured" />
        <ProductSlider title="Más Vendidos" section="masVendidos" />
        <ProductSlider title="Nuevos Ingresos" section="newProducts" />
        <ProductSlider title="Packs/Combos" section="packs" />
        <ProductSlider title="Liquidaciones/Ofertas" section="sales" />
        <Info />
        <ProductSlider title="Blanquería" section="blanqueria" />
        <ProductSlider title="Lencería" section="lenceria" />
        <ProductSlider title="Calzado" section="calzado" />
        <ProductSlider title="Bisutería" section="bisuteria" />
        <ProductSlider title="Telas" section="telas" />
        <ProductSlider title="Máquinas" section="maquinas" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  homeContent: {
    // paddingHorizontal: 8,
    paddingBottom: 6,
    gap: 6,
  },
});

export default HomeScreen;
