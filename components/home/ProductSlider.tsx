import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { RootState } from '@/store';
import { Colors } from '@/constants/Colors';

interface ProductSliderProps {
  title: string;
  section: 'featured' | 'newProducts' | 'packs' | 'sales' | 'blanqueria' | 'lenceria' | 'calzado' | 'bisuteria' | 'telas' | 'insumos' | 'maquinas';
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, section }) => {
  const { [section]: products, loading, error } = useSelector((state: RootState) => state.product);
  const router = useRouter();

  const handleProductPress = (product: any) => {
    console.log('🛍️ Navegando al producto:', product.id);
    router.push(`/(tabs)/producto/${product.id}` as any);
  };

  const handleMorePress = () => {
    Alert.alert('Ver más', `Ver más productos de ${title}`);
    console.log('Ver más productos de:', title);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.mainImage || 'https://via.placeholder.com/140x186' }}
          style={styles.productImage}
          resizeMode="cover"
        />
        {item.logo && (
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: item.logo }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          {item.onSale && item.salePrice > 0 ? (
            <>
              <Text style={styles.originalPrice}>{formatPrice(item.price)}</Text>
              <Text style={styles.salePrice}>{formatPrice(item.salePrice)}</Text>
            </>
          ) : (
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && products.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={handleMorePress}>
            <Text style={styles.moreText}>más &gt;</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={handleMorePress}>
            <Text style={styles.moreText}>más &gt;</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al cargar productos</Text>
        </View>
      </View>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.moreButton} onPress={handleMorePress} activeOpacity={0.7}>
          <Text style={styles.moreText}>Ver más</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.blue.default} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  moreText: {
    fontSize: 13,
    color: Colors.blue.default,
    fontWeight: '500',
    marginRight: 2,
  },
  listContainer: {
    paddingHorizontal: 4,
  },
  separator: {
    width: 12,
  },
  productCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240, // Proporción 3:4 para 180px de ancho (180 * 1.33)
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    // padding: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  productInfo: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    minHeight: 70, // Altura mínima para mantener consistencia
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    // marginBottom: 6,
    lineHeight: 16,
    minHeight: 16, // Altura mínima para 2 líneas de texto
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 20,
    fontWeight: '400',
    color: Colors.gray.semiDark,
  },
  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  salePrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.orange.default,
  },
  loadingContainer: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  errorContainer: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
});

export default ProductSlider;