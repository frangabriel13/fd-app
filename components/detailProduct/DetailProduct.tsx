import { View, Text, StyleSheet, Pressable, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useDispatch, useSelector } from 'react-redux';
import { Product, Manufacturer } from '@/types/product';
import { addFavorite, removeFavorite } from '@/store/slices/favoriteSlice';
import { setCurrentProductIsFavorite } from '@/store/slices/productSlice';
import { AppDispatch, RootState } from '@/store';
import { formatPrice } from '@/utils/formatPrice';
import { Colors } from '@/constants/Colors';

interface DetailProductProps {
  product?: Product;
  manufacturer?: Manufacturer;
  views?: number;
}

const DetailProduct = ({ product, manufacturer, views }: DetailProductProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isFavorite = useSelector((state: RootState) => state.product.currentProductIsFavorite);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const handleWhatsApp = () => {
    if (!manufacturer?.phone) return;
    const phone = manufacturer.phone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${phone}`);
  };

  const handleToggleFavorite = async () => {
    if (!product?.id) return;
    if (userRole !== 'wholesaler') {
      Alert.alert(
        'Acceso restringido',
        'Iniciá sesión como mayorista para agregar productos a favoritos',
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }
    const productId = parseInt(product.id);
    try {
      if (isFavorite) {
        await dispatch(removeFavorite(productId)).unwrap();
        dispatch(setCurrentProductIsFavorite(false));
      } else {
        await dispatch(addFavorite(productId)).unwrap();
        dispatch(setCurrentProductIsFavorite(true));
      }
    } catch (error: any) {
      console.error('Error al actualizar favoritos:', error);
    }
  };

  const hasDiscount = product?.onSale && product.salePrice > 0;
  const discountPercent =
    hasDiscount && product
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <View>
      {/* ── Tags: categoría, género, importado, vistas ── */}
      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{product?.category.name}</Text>
        </View>
        {product?.gender && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{product.gender.name}</Text>
          </View>
        )}
        {product?.isImported && (
          <View style={[styles.tag, styles.tagAccent]}>
            <Text style={[styles.tagText, styles.tagAccentText]}>Importado</Text>
          </View>
        )}
        {views != null && (
          <View style={styles.viewsTag}>
            <Ionicons name="eye-outline" size={12} color={Colors.gray.semiDark} />
            <Text style={styles.viewsText}>{views} vistas</Text>
          </View>
        )}
      </View>

      {/* ── Nombre + compartir + favorito ── */}
      <View style={styles.nameRow}>
        <Text style={styles.productName}>{product?.name}</Text>
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
            hitSlop={8}
          >
            <Ionicons name="share-outline" size={22} color={Colors.blue.dark} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
            onPress={handleToggleFavorite}
            hitSlop={8}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={Colors.orange.dark}
            />
          </Pressable>
        </View>
      </View>

      {/* ── Precio ── */}
      <View style={styles.priceBlock}>
        {hasDiscount ? (
          <View style={styles.priceRow}>
            <Text style={styles.priceOriginal}>{formatPrice(product!.price)}</Text>
            <Text style={styles.priceSale}>{formatPrice(product!.salePrice)}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercent}%</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.price}>{formatPrice(product?.price ?? 0)}</Text>
        )}
        <Text style={styles.priceLabel}>Precio mayorista · por unidad</Text>
      </View>

      <View style={styles.divider} />

      {/* ── Fabricante: logo + nombre + ubicación ── */}
      <View style={styles.manufacturerRow}>
        {manufacturer?.image ? (
          <Image
            source={{ uri: manufacturer.image }}
            style={styles.manufacturerLogo}
            contentFit="contain"
          />
        ) : (
          <View style={styles.manufacturerLogoFallback}>
            <Ionicons name="business-outline" size={18} color={Colors.blue.dark} />
          </View>
        )}
        <View style={styles.manufacturerInfo}>
          <Text style={styles.manufacturerName} numberOfLines={1}>
            {manufacturer?.name}
          </Text>
          {manufacturer?.street ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color={Colors.gray.semiDark} />
              <Text style={styles.locationText} numberOfLines={1}>
                {manufacturer.street}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* ── WhatsApp ── */}
      <Pressable
        style={[styles.whatsappBtn, !manufacturer?.phone && styles.whatsappDisabled]}
        android_ripple={{ color: 'rgba(0,0,0,0.12)' }}
        onPress={handleWhatsApp}
        disabled={!manufacturer?.phone}
      >
        <Ionicons name="logo-whatsapp" size={20} color="#fff" />
        <Text style={styles.whatsappText}>
          Contactar a {manufacturer?.name ?? 'el fabricante'}
        </Text>
      </Pressable>

      {/* ── Descripción ── */}
      {product?.description ? (
        <View style={styles.descriptionBlock}>
          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  // Nombre + acciones
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  productName: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 26,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 2,
  },
  actionBtn: {
    padding: 4,
  },

  // Fabricante
  manufacturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  manufacturerLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    backgroundColor: '#f8f8f8',
  },
  manufacturerLogoFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    backgroundColor: Colors.blue.dark + '0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manufacturerInfo: {
    flex: 1,
    gap: 2,
  },
  manufacturerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.blue.dark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 12,
    color: Colors.gray.semiDark,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray.light,
    marginVertical: 12,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: Colors.gray.light,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: Colors.gray.dark,
    fontWeight: '500',
  },
  tagAccent: {
    backgroundColor: Colors.blue.dark + '12',
  },
  tagAccentText: {
    color: Colors.blue.dark,
  },
  viewsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  viewsText: {
    fontSize: 12,
    color: Colors.gray.semiDark,
  },

  // Precio
  priceBlock: {
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  priceOriginal: {
    fontSize: 16,
    color: Colors.gray.default,
    textDecorationLine: 'line-through',
  },
  priceSale: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.orange.dark,
  },
  discountBadge: {
    backgroundColor: Colors.orange.dark + '18',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.orange.dark,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.gray.semiDark,
    marginTop: 3,
  },

  // WhatsApp
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25d366',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 4,
  },
  whatsappDisabled: {
    backgroundColor: Colors.gray.default,
  },
  whatsappText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // Descripción
  descriptionBlock: {
    marginTop: 14,
    gap: 6,
  },
  descriptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.gray.semiDark,
    lineHeight: 21,
  },
});

export default DetailProduct;
