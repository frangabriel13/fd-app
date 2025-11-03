import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchLiveManufacturers } from '../../store/slices/manufacturerSlice';
import Images from '@/constants/Images';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 32 - 24) / 4; // 32 padding horizontal, 24 gaps entre elementos
const logoDefault = Images.defaultImages.logoDefault;

const LiveManufacturers = () => {
  const dispatch = useAppDispatch();
  const manufacturerState = useAppSelector((state) => state.manufacturer);

  useEffect(() => {
    // Solo hacer fetch una vez al montar el componente
    dispatch(fetchLiveManufacturers({ page: 1, pageSize: 20 }));
  }, [dispatch]);

  const handleSeeMore = () => {
    // TODO: Navegar a la pantalla completa de fabricantes en vivo
    console.log('Ver más fabricantes en vivo');
  };

  const handleManufacturerPress = (manufacturer: any) => {
    // TODO: Abrir el live del fabricante
    console.log('Abrir live de:', manufacturer.name);
  };

  // Proteger contra estado undefined durante la hidratación de Redux Persist
  if (!manufacturerState) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }
  
  const { liveManufacturers, loading } = manufacturerState;

  // Proteger contra undefined - Redux persist puede causar estados temporalmente undefined
  const manufacturers = liveManufacturers || [];

  if (loading && manufacturers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Live Shopping</Text>
          <TouchableOpacity onPress={handleSeeMore}>
            <Text style={styles.seeMore}>más{'>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  if (manufacturers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Live Shopping</Text>
          <TouchableOpacity onPress={handleSeeMore}>
            <Text style={styles.seeMore}>más{'>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay fabricantes en vivo</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Shopping</Text>
        <TouchableOpacity onPress={handleSeeMore}>
          <Text style={styles.seeMore}>más{'>'}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        {manufacturers.map((manufacturer, index) => (
          <TouchableOpacity
            key={manufacturer.id}
            style={[
              styles.manufacturerItem,
              index === 0 && styles.firstItem,
              index === manufacturers.length - 1 && styles.lastItem
            ]}
            onPress={() => handleManufacturerPress(manufacturer)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={manufacturer.image ? { uri: manufacturer.image } : logoDefault}
                style={[
                  styles.avatar,
                  manufacturer.live && styles.avatarLive // Aplica el borde si está en vivo
                ]}
                resizeMode="cover"
              />
              {manufacturer.live && <View style={styles.liveIndicator} />}
            </View>
            <Text style={styles.manufacturerName} numberOfLines={1}>
              {manufacturer.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeMore: {
    fontSize: 14,
    color: '#0a7ea4',
    fontWeight: '500',
  },
  scrollView: {
    paddingLeft: 16,
  },
  scrollContainer: {
    paddingRight: 16,
  },
  manufacturerItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    marginRight: 8,
  },
  firstItem: {
    marginLeft: 0,
  },
  lastItem: {
    marginRight: 0,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: ITEM_WIDTH - 8,
    height: ITEM_WIDTH - 8,
    borderRadius: (ITEM_WIDTH - 8) / 2,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  avatarLive: {
    borderColor: '#ff4444', // Cambia el color del borde si está en vivo
    borderWidth: 3, // Aumenta el grosor del borde
  },
  liveIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ff4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  manufacturerName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
});

export default LiveManufacturers;