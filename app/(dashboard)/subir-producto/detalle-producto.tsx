import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import SelectColors from '@/components/createProduct/SelectColors';
import SelectSizes from '@/components/createProduct/SelectSizes';
import SelectImages from '@/components/createProduct/SelectImages';
import { createProduct, resetCreateState } from '@/store/slices/productSlice';
import type { AppDispatch, RootState } from '@/store';

const DetalleProductoScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { categoryId, genderId, isVariable } = useLocalSearchParams<{
    categoryId?: string;
    genderId?: string;
    isVariable?: string;
  }>();

  // Redux state
  const { createdProduct, isCreating, createError } = useSelector((state: RootState) => state.product);
  const { uploadedImages } = useSelector((state: RootState) => state.image);
  
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    isOnSale: false,
    tags: [] as string[],
    images: [] as string[],
    colors: [] as string[],
    sizes: [] as number[], // Changed to number[] to match API
    colorVariations: [] as Array<{ colorId: number; mainImage: string; images: string[] }>
  });

  const [showColorModal, setShowColorModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Consoleguear los parámetros recibidos y limpiar estado
  useEffect(() => {
    console.log('=== PARÁMETROS RECIBIDOS EN DETALLE-PRODUCTO ===');
    console.log('categoryId:', categoryId);
    console.log('genderId:', genderId);
    console.log('isVariable:', isVariable);
    console.log('===============================================');
    
    // Limpiar estado de creación anterior
    dispatch(resetCreateState());
  }, [categoryId, genderId, isVariable, dispatch]);

  // Manejar cambios en los colores para productos variables
  useEffect(() => {
    if (isVariable === 'true' && productData.colors.length > 0) {
      // Usar imágenes disponibles (prioritizar estado local)
      const availableImages = productData.images.length > 0 ? productData.images : 
                             uploadedImages.length > 0 ? uploadedImages.map(img => img.url) : [];
      
      if (availableImages.length > 0) {
        // Crear variaciones de color automáticamente cuando se seleccionan colores
        const variations = productData.colors.map((colorId, index) => ({
          colorId: parseInt(colorId),
          mainImage: availableImages[0] || '',
          images: availableImages // Incluir todas las imágenes, incluyendo la principal
        }));
        
        setProductData(prev => ({
          ...prev,
          colorVariations: variations
        }));
      }
    }
  }, [productData.colors, productData.images, uploadedImages, isVariable]);

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
    const hasImages = productData.images.length > 0 || uploadedImages.length > 0;
    if (!hasImages) return false;

    // Validaciones específicas según tipo de producto
    if (isVariable === 'true') {
      // Para productos variables, necesitamos al menos un color seleccionado
      return productData.colors.length > 0;
    } else {
      // Para productos simples, necesitamos al menos un talle
      return productData.sizes.length > 0;
    }
  };

  const handleSelectImage = () => {
    setShowImageModal(true);
  };

  const handleImagesChange = (images: string[]) => {
    console.log('=== IMAGES CHANGED ===');
    console.log('New images from SelectImages:', images);
    console.log('Current productData.images:', productData.images);
    console.log('=====================');
    
    setProductData(prev => ({
      ...prev,
      images: images
    }));
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  const handleColorsChange = (colors: string[]) => {
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

  const handleSizesChange = (sizes: string[]) => {
    // Convertir strings a números para que coincidan con la API
    const sizeNumbers = sizes.map(size => parseInt(size)).filter(size => !isNaN(size));
    setProductData(prev => ({
      ...prev,
      sizes: sizeNumbers
    }));
  };

  const handleOpenSizeModal = () => {
    setShowSizeModal(true);
  };

  const handleCloseSizeModal = () => {
    setShowSizeModal(false);
  };

  const handleAddSize = (size: string) => {
    const sizeNumber = parseInt(size);
    if (!isNaN(sizeNumber) && !productData.sizes.includes(sizeNumber)) {
      setProductData(prev => ({
        ...prev,
        sizes: [...prev.sizes, sizeNumber]
      }));
    }
  };

  const handleRemoveSize = (size: string) => {
    const sizeNumber = parseInt(size);
    if (!isNaN(sizeNumber)) {
      setProductData(prev => ({
        ...prev,
        sizes: prev.sizes.filter(s => s !== sizeNumber)
      }));
    }
  };

  const handleFinish = async () => {
    if (!isFormValid()) {
      Alert.alert('Formulario incompleto', 'Por favor completa todos los campos requeridos');
      return;
    }

    try {
      // Verificar que tengamos imágenes (prioritizar imágenes del estado local)
      const availableImages = productData.images.length > 0 ? productData.images : 
                             uploadedImages.length > 0 ? uploadedImages.map(img => img.url) : [];
      
      if (availableImages.length === 0) {
        Alert.alert('Imágenes requeridas', 'Debes subir al menos una imagen del producto');
        return;
      }

      // Validar parámetros necesarios
      if (!categoryId || !genderId || !isVariable) {
        Alert.alert('Error', 'Faltan parámetros necesarios para crear el producto');
        return;
      }

      const mainImage = availableImages[0] || '';
      const additionalImages = availableImages; // Incluir todas las imágenes, incluyendo la principal
      // Para imgIds, usar los del Redux si están disponibles, sino generar IDs temporales
      const imgIds = uploadedImages.length > 0 ? 
                    uploadedImages.map(img => img.id) : 
                    availableImages.map((_, index) => Date.now() + index);

      console.log('=== DEBUG COMPLETO ===');
      console.log('productData.images:', productData.images);
      console.log('uploadedImages:', uploadedImages);
      console.log('uploadedImages.length:', uploadedImages.length);
      console.log('uploadedImages URLs:', uploadedImages.map(img => img.url));
      console.log('availableImages:', availableImages);
      console.log('mainImage:', mainImage);
      console.log('additionalImages (todas incluyendo main):', additionalImages);
      console.log('imgIds:', imgIds);
      console.log('========================');

      if (isVariable === 'true') {
        // Crear producto variable
        const productPayload = {
          name: productData.name.trim(),
          description: productData.description.trim(),
          price: parseFloat(productData.price),
          onSale: productData.isOnSale,
          tags: [],
          mainImage: mainImage,
          images: additionalImages,
          imgIds: imgIds,
          sizes: productData.sizes,
          genderId: parseInt(genderId),
          categoryId: parseInt(categoryId),
          isVariable: true as const,
          variations: productData.colorVariations.map(variation => ({
            ...variation,
            mainImage: variation.mainImage || mainImage,
            images: variation.images.length > 0 ? variation.images : availableImages
          }))
        };

        console.log('Creando producto variable:', productPayload);
        await dispatch(createProduct(productPayload)).unwrap();
      } else {
        // Crear producto simple
        const productPayload = {
          name: productData.name.trim(),
          description: productData.description.trim(),
          price: parseFloat(productData.price),
          onSale: productData.isOnSale,
          tags: [],
          mainImage: mainImage,
          images: additionalImages,
          imgIds: imgIds,
          sizes: productData.sizes,
          genderId: parseInt(genderId),
          categoryId: parseInt(categoryId),
          isVariable: false as const
        };

        console.log('Creando producto simple:', productPayload);
        await dispatch(createProduct(productPayload)).unwrap();
      }

      // Si llegamos aquí, el producto se creó exitosamente
      Alert.alert(
        '¡Éxito!',
        'El producto se ha creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpiar estado y navegar
              dispatch(resetCreateState());
              router.push('/(tabs)/');
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      Alert.alert(
        'Error al crear producto',
        error || 'Ha ocurrido un error inesperado. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Typography variant="h2" className="text-center text-gray-800 mb-2">
          Detalles del producto
        </Typography>
        
        <Typography variant="body2" className="text-center text-gray-600 mb-8">
          Completa la información de tu producto
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
              Imágenes
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

          {/* Mostrar selección de colores si isVariable es "true" */}
          {isVariable === 'true' && (
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
                    : 'Toca para elegir los colores disponibles'
                  }
                </Typography>
              </TouchableOpacity>
            </View>
          )}

          {/* Mostrar selección de talles si isVariable es "false" */}
          {isVariable === 'false' && (
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
                    : 'Toca para elegir los talles disponibles'
                  }
                </Typography>
                {productData.sizes.length > 0 && (
                  <Typography variant="caption" className="text-gray-600 text-center mt-1">
                    {productData.sizes.join(', ')}
                  </Typography>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {createError && (
          <View style={styles.errorMessage}>
            <Typography variant="caption" className="text-red-600 text-center">
              {createError}
            </Typography>
          </View>
        )}
        
        <Button
          variant="primary"
          onPress={handleFinish}
          disabled={!isFormValid() || isCreating}
          style={[
            styles.finishButton,
            (!isFormValid() || isCreating) && styles.disabledButton
          ]}
          className="bg-primary"
        >
          {isCreating ? 'Creando producto...' : 'Finalizar'}
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
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  finishButton: {
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

export default DetalleProductoScreen;
