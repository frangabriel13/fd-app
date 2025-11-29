import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
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
          source={{ uri: item.mainImage || 'https://via.placeholder.com/150' }}
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
        <TouchableOpacity onPress={handleMorePress}>
          <Text style={styles.moreText}>más &gt;</Text>
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
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  moreText: {
    fontSize: 14,
    color: Colors.blue.default,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  separator: {
    width: 12,
  },
  productCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 2,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.blue.default,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.orange.default,
  },
  loadingContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  errorContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
});

export default ProductSlider;