import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Product, Manufacturer } from '@/types/product';
import { formatPrice } from '@/utils/formatPrice';
import { Colors } from '@/constants/Colors';

interface DetailProductProps {
  product?: Product;
  manufacturer?: Manufacturer;
  views?: number;
}

const DetailProduct = ({ product, manufacturer, views }: DetailProductProps) => {
  const handleWhatsApp = () => {
    if (!manufacturer?.phone) return;
    const phone = manufacturer.phone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${phone}`);
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

      {/* ── Nombre del producto ── */}
      <Text style={styles.productName}>{product?.name}</Text>

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
        <Text style={styles.priceLabel}>Comprando al por mayor</Text>
      </View>

      <View style={styles.divider} />

      {/* ── Fabricante: izquierda → tienda | derecha → maps ── */}
      <View style={styles.manufacturerRow}>
        {/* Logo + nombre → tienda */}
        <Pressable
          style={styles.manufacturerLeft}
          android_ripple={{ color: Colors.gray.light }}
          onPress={() => manufacturer?.id && router.push(`/(tabs)/store/${manufacturer.id}` as any)}
        >
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
            <Text style={styles.manufacturerSublabel}>Ver tienda</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={Colors.gray.default} />
        </Pressable>

        {/* Dirección → maps */}
        {manufacturer?.street ? (
          <Pressable
            style={styles.manufacturerRight}
            android_ripple={{ color: Colors.gray.light }}
            onPress={() => {
              const query = encodeURIComponent(manufacturer.street);
              Linking.openURL(`https://maps.google.com/?q=${query}`);
            }}
          >
            <Ionicons name="map-outline" size={16} color={Colors.blue.dark} />
            <Text style={styles.locationText} numberOfLines={2}>
              {manufacturer.street}
            </Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.gray.default} />
          </Pressable>
        ) : null}
      </View>

      {/* ── WhatsApp ── */}
      <Pressable
        style={[styles.whatsappBtn, !manufacturer?.phone && styles.whatsappDisabled]}
        android_ripple={{ color: '#1fba59' }}
        onPress={handleWhatsApp}
        disabled={!manufacturer?.phone}
      >
        <View style={styles.whatsappBtnInner}>
          <Ionicons name="logo-whatsapp" size={16} color="#fff" />
          <Text style={styles.whatsappText}>
            Contactar a {manufacturer?.name ?? 'el fabricante'}
          </Text>
        </View>
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
  // Nombre
  productName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 26,
    marginBottom: 6,
  },

  // Fabricante
  manufacturerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    marginBottom: 10,
  },
  manufacturerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.gray.light,
    borderRadius: 8,
    padding: 8,
  },
  manufacturerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.gray.light,
    borderRadius: 8,
    padding: 8,
  },
  manufacturerLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    backgroundColor: '#f8f8f8',
  },
  manufacturerLogoFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    backgroundColor: Colors.blue.dark + '0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manufacturerInfo: {
    flex: 1,
    gap: 1,
  },
  manufacturerName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.blue.dark,
  },
  manufacturerSublabel: {
    fontSize: 11,
    color: Colors.gray.semiDark,
  },
  locationText: {
    fontSize: 12,
    color: Colors.gray.semiDark,
    flex: 1,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray.light,
    marginVertical: 10,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
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
    marginBottom: 6,
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
    marginTop: 4,
  },

  // WhatsApp
  whatsappBtn: {
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  whatsappBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    backgroundColor: '#25d366',
    borderRadius: 6,
  },
  whatsappDisabled: {
    opacity: 0.45,
  },
  whatsappText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Descripción
  descriptionBlock: {
    marginTop: 20,
    gap: 8,
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
