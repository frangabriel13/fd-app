import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import SelectColors from '@/components/createProduct/SelectColors';
import SelectSizes from '@/components/createProduct/SelectSizes';
import SelectImages from '@/components/createProduct/SelectImages';
import { fetchProductWithManufacturer, updateProduct, resetUpdateState } from '@/store/slices/productSlice';
import type { AppDispatch, RootState } from '@/store';

const EditarProductoScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { productId } = useLocalSearchParams<{
    productId?: string;
  }>();

  // Redux state
  const { currentProduct, loading, updatedProduct, isUpdating, updateError } = useSelector((state: RootState) => state.product);
  const { uploadedImages } = useSelector((state: RootState) => state.image);
  
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    isOnSale: false,
    tags: [] as string[],
    images: [] as string[],
    colors: [] as number[],
    sizes: [] as number[],
    colorVariations: [] as Array<{ colorId: number; mainImage: string; images: string[] }>
  });

  const [showColorModal, setShowColorModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar el producto cuando el componente se monta
  useEffect(() => {
    if (!productId) {
      Alert.alert('Error', 'No se encontró el ID del producto');
      router.back();
      return;
    }

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        await dispatch(fetchProductWithManufacturer(productId)).unwrap();
      } catch (error: any) {
        Alert.alert('Error', error || 'No se pudo cargar el producto');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
    dispatch(resetUpdateState());
  }, [productId, dispatch]);

  // Cargar datos del producto en el formulario cuando se obtenga del backend
  useEffect(() => {
    if (currentProduct) {
      console.log('=== PRODUCTO CARGADO ===');
      console.log('currentProduct:', currentProduct);
      console.log('currentProduct.sizes:', currentProduct.sizes);
      console.log('currentProduct.variations:', currentProduct.variations);
      console.log('========================');

      // Extraer sizes del array de sizes
      const sizes: number[] = [];
      if (currentProduct.sizes && currentProduct.sizes.length > 0) {
        currentProduct.sizes.forEach((size: any) => {
          if (size.id && !sizes.includes(size.id)) {
            sizes.push(size.id);
          }
        });
      }

      // Extraer colors del array de variations
      const colors: number[] = [];
      if (currentProduct.variations && currentProduct.variations.length > 0) {
        currentProduct.variations.forEach((variation: any) => {
          if (variation.colorId && !colors.includes(variation.colorId)) {
            colors.push(variation.colorId);
          }
        });
      }

      console.log('Sizes extraídos:', sizes);
      console.log('Colors extraídos:', colors);

      // Construir variaciones de color si es variable
      let colorVariations: Array<{ colorId: number; mainImage: string; images: string[] }> = [];
      if (currentProduct.isVariable && currentProduct.variations) {
        colorVariations = currentProduct.variations.map((variation: any) => ({
          colorId: variation.colorId,
          mainImage: currentProduct.mainImage || '',
          images: currentProduct.images || [currentProduct.mainImage || '']
        }));
      }

      console.log('Color variations construidas:', colorVariations);

      setProductData({
        name: currentProduct.name || '',
        price: currentProduct.price?.toString() || '',
        description: currentProduct.description || '',
        isOnSale: currentProduct.onSale || false,
        tags: currentProduct.tags || [],
        images: currentProduct.images || (currentProduct.mainImage ? [currentProduct.mainImage] : []),
        colors: colors,
        sizes: sizes,
        colorVariations: colorVariations
      });
    }
  }, [currentProduct]);

  // Manejar cambios en los colores para productos variables
  useEffect(() => {
    if (currentProduct?.isVariable && productData.colors.length > 0) {
      const availableImages = productData.images.length > 0 ? productData.images : 
                             uploadedImages.length > 0 ? uploadedImages.map(img => img.url) : [];
      
      if (availableImages.length > 0) {
        // Crear variaciones de color automáticamente cuando se seleccionan colores
        const variations = productData.colors.map((colorId) => {
          // Mantener variación existente si ya existe
          const existing = productData.colorVariations.find(v => v.colorId === colorId);
          return existing || {
            colorId: colorId,
            mainImage: availableImages[0] || '',
            images: availableImages
          };
        });
        
        setProductData(prev => ({
          ...prev,
          colorVariations: variations
        }));
      }
    }
  }, [productData.colors, productData.images, uploadedImages, currentProduct?.isVariable]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    const baseValid = productData.name.trim() !== '' && 
                     productData.description.trim() !== '' && 
                     productData.price.trim() !== '' &&
                     !isNaN(parseFloat(productData.price)) &&
                     parseFloat(productData.price) > 0;

    if (!baseValid) return false;

    // Verificar que tengamos al menos una imagen
    const hasImages = productData.images.length > 0;
    if (!hasImages) return false;

    // Para categorías que no son indumentaria (no tienen genderId), solo validar datos básicos
    if (!currentProduct?.gender?.id) {
      return true;
    }

    // Validaciones específicas según tipo de producto
    if (currentProduct?.isVariable) {
      return productData.colors.length > 0;
    } else {
      return productData.sizes.length > 0;
    }
  };

  const handleSelectImage = () => {
    setShowImageModal(true);
  };

  const handleImagesChange = (images: string[]) => {
    console.log('=== IMAGES CHANGED ===');
    console.log('New images from SelectImages:', images);
    console.log('=====================');
    
    setProductData(prev => ({
      ...prev,
      images: images
    }));
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  const handleColorsChange = (colors: number[]) => {
    setProductData(prev => ({
      ...prev,
      colors: colors
    }));
  };

  const handleOpenColorModal = () => {
    setShowColorModal(true);
  };

  const handleCloseColorModal = () => {
    setShowColorModal(false);
  };

  const handleSizesChange = (sizes: number[]) => {
    setProductData(prev => ({
      ...prev,
      sizes: sizes
    }));
  };

  const handleOpenSizeModal = () => {
    setShowSizeModal(true);
  };

  const handleCloseSizeModal = () => {
    setShowSizeModal(false);
  };

  const handleUpdate = async () => {
    if (!isFormValid()) {
      Alert.alert('Formulario incompleto', 'Por favor completa todos los campos requeridos');
      return;
    }

    if (!productId || !currentProduct) {
      Alert.alert('Error', 'No se encontró el producto a actualizar');
      return;
    }

    try {
      const availableImages = productData.images.length > 0 ? productData.images : [];
      
      if (availableImages.length === 0) {
        Alert.alert('Imágenes requeridas', 'Debes tener al menos una imagen del producto');
        return;
      }

      const mainImage = availableImages[0] || '';
      const additionalImages = availableImages;
      const imgIds = uploadedImages.length > 0 ? 
                    uploadedImages.map(img => img.id) : 
                    availableImages.map((_, index) => Date.now() + index);

      console.log('=== DEBUG ACTUALIZACIÓN ===');
      console.log('productId:', productId);
      console.log('currentProduct.isVariable:', currentProduct.isVariable);
      console.log('currentProduct.gender:', currentProduct.gender);
      console.log('productData.images:', productData.images);
      console.log('availableImages:', availableImages);
      console.log('mainImage:', mainImage);
      console.log('========================');

      if (currentProduct.isVariable) {
        // Actualizar producto variable
        const productPayload = {
          name: productData.name.trim(),
          description: productData.description.trim(),
          price: parseFloat(productData.price),
          onSale: productData.isOnSale,
          tags: productData.tags,
          mainImage: mainImage,
          images: additionalImages,
          imgIds: imgIds,
          sizes: productData.sizes,
          genderId: currentProduct.gender?.id || 0,
          categoryId: currentProduct.category?.id || 0,
          isVariable: true as const,
          variations: productData.colorVariations.map(variation => ({
            ...variation,
            mainImage: variation.mainImage || mainImage,
            images: variation.images.length > 0 ? variation.images : availableImages
          }))
        };

        console.log('Actualizando producto variable:', productPayload);
        await dispatch(updateProduct({ productId, productData: productPayload })).unwrap();
      } else {
        // Actualizar producto simple
        const productPayload = {
          name: productData.name.trim(),
          description: productData.description.trim(),
          price: parseFloat(productData.price),
          onSale: productData.isOnSale,
          tags: productData.tags,
          mainImage: mainImage,
          images: additionalImages,
          imgIds: imgIds,
          sizes: productData.sizes,
          isVariable: false as const
        };

        console.log('Actualizando producto simple:', productPayload);
        await dispatch(updateProduct({ productId, productData: productPayload })).unwrap();
      }

      // Si llegamos aquí, el producto se actualizó exitosamente
      Alert.alert(
        '¡Éxito!',
        'El producto se ha actualizado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              dispatch(resetUpdateState());
              router.back();
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      Alert.alert(
        'Error al actualizar producto',
        error || 'Ha ocurrido un error inesperado. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    }
  };

  if (isLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Typography variant="body" className="text-gray-500 mt-4">
          Cargando producto...
        </Typography>
      </View>
    );
  }

  if (!currentProduct) {
    return (
      <View style={styles.loadingContainer}>
        <Typography variant="body" className="text-gray-500">
          No se pudo cargar el producto
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Typography variant="h2" className="text-center text-gray-800 mb-2">
          Editar producto
        </Typography>
        
        <Typography variant="body2" className="text-center text-gray-600 mb-8">
          Modifica la información de tu producto
        </Typography>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Typography variant="h4" className="text-gray-700 mb-2">
              Nombre del producto *
            </Typography>
            <TextInput
              placeholder="Ej: Remera básica de algodón"
              value={productData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholderTextColor="#9CA3AF"
              className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="h4" className="text-gray-700 mb-2">
              Precio *
            </Typography>
            <TextInput
              placeholder="0.00"
              value={productData.price}
              onChangeText={(value) => handleInputChange('price', value)}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Typography variant="h4" className="text-gray-700 flex-1">
                Producto en oferta o liquidación
              </Typography>
              <Switch
                value={productData.isOnSale}
                onValueChange={(value) => handleInputChange('isOnSale', value)}
                trackColor={{ false: '#e5e7eb', true: '#f97316' }}
                thumbColor={productData.isOnSale ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="h4" className="text-gray-700 mb-2">
              Descripción *
            </Typography>
            <TextInput
              placeholder="Describe tu producto en detalle"
              value={productData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
              className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
              style={{ textAlignVertical: 'top', minHeight: 100 }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="h4" className="text-gray-700 mb-2">
              Imágenes *
            </Typography>
            <TouchableOpacity 
              onPress={handleSelectImage}
              className="border border-dashed border-gray-300 bg-gray-50 rounded-md px-4 py-8 mb-4 items-center justify-center"
            >
              <Typography variant="body" className="text-gray-500 text-center">
                📷 Seleccionar imágenes
              </Typography>
              <Typography variant="caption" className="text-gray-400 text-center mt-1">
                {productData.images.length > 0 
                  ? `${productData.images.length} imagen(es) seleccionada(s)` 
                  : 'Toca para agregar fotos del producto'
                }
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Mostrar selección de colores si es producto variable */}
          {currentProduct.isVariable && currentProduct.gender?.id && (
            <View style={styles.inputGroup}>
              <Typography variant="h4" className="text-gray-700 mb-2">
                Colores disponibles
              </Typography>
              <TouchableOpacity 
                onPress={handleOpenColorModal}
                className="border border-dashed border-gray-300 bg-gray-50 rounded-md px-4 py-8 mb-4 items-center justify-center"
              >
                <Typography variant="body" className="text-gray-500 text-center">
                  🎨 Seleccionar colores
                </Typography>
                <Typography variant="caption" className="text-gray-400 text-center mt-1">
                  {productData.colors.length > 0 
                    ? `${productData.colors.length} color(es) seleccionado(s)` 
                    : 'Toca para seleccionar colores'
                  }
                </Typography>
              </TouchableOpacity>
            </View>
          )}

          {/* Mostrar selección de talles si NO es producto variable */}
          {!currentProduct.isVariable && currentProduct.gender?.id && (
            <View style={styles.inputGroup}>
              <Typography variant="h4" className="text-gray-700 mb-2">
                Talles disponibles
              </Typography>
              <TouchableOpacity 
                onPress={handleOpenSizeModal}
                className="border border-dashed border-gray-300 bg-gray-50 rounded-md px-4 py-8 mb-4 items-center justify-center"
              >
                <Typography variant="body" className="text-gray-500 text-center">
                  📏 Seleccionar talles
                </Typography>
                <Typography variant="caption" className="text-gray-400 text-center mt-1">
                  {productData.sizes.length > 0 
                    ? `${productData.sizes.length} talle(s) seleccionado(s)` 
                    : 'Toca para seleccionar talles'
                  }
                </Typography>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {updateError && (
          <View style={styles.errorMessage}>
            <Typography variant="caption" className="text-red-600 text-center">
              {updateError}
            </Typography>
          </View>
        )}
        
        <Button
          variant="primary"
          onPress={handleUpdate}
          disabled={!isFormValid() || isUpdating}
          style={[
            styles.updateButton,
            (!isFormValid() || isUpdating) && styles.disabledButton
          ]}
          className="bg-primary"
        >
          {isUpdating ? 'Actualizando producto...' : 'Guardar cambios'}
        </Button>
      </View>

      {/* Modal de selección de imágenes */}
      <SelectImages
        visible={showImageModal}
        onClose={handleCloseImageModal}
        selectedImages={productData.images}
        onSelectionChange={handleImagesChange}
      />

      {/* Modal de selección de colores */}
      <SelectColors
        visible={showColorModal}
        onClose={handleCloseColorModal}
        selectedColors={productData.colors}
        onSelectionChange={handleColorsChange}
      />

      {/* Modal de selección de talles */}
      <SelectSizes
        visible={showSizeModal}
        onClose={handleCloseSizeModal}
        selectedSizes={productData.sizes}
        onSelectionChange={handleSizesChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  formContainer: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  updateButton: {
    minHeight: 50,
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorMessage: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#fef2f2',
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
});

export default EditarProductoScreen;
