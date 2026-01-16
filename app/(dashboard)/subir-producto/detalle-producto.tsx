import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import SelectColors from '@/components/createProduct/SelectColors';
import SelectSizes from '@/components/createProduct/SelectSizes';

const DetalleProductoScreen = () => {
  const router = useRouter();
  const { categoryId, genderId, isVariable } = useLocalSearchParams<{
    categoryId?: string;
    genderId?: string;
    isVariable?: string;
  }>();
  
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    isOnSale: false,
    images: [] as string[],
    colors: [] as string[],
    sizes: [] as string[]
  });

  const [showColorModal, setShowColorModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Consoleguear los parámetros recibidos
  useEffect(() => {
    console.log('=== PARÁMETROS RECIBIDOS EN DETALLE-PRODUCTO ===');
    console.log('categoryId:', categoryId);
    console.log('genderId:', genderId);
    console.log('isVariable:', isVariable);
    console.log('===============================================');
  }, [categoryId, genderId, isVariable]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return productData.name.trim() !== '' && 
           productData.description.trim() !== '' && 
           productData.price.trim() !== '';
  };

  const handleSelectImage = () => {
    // Implementar selección de imágenes
    console.log('Seleccionar imágenes');
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

  const handleAddSize = (size: string) => {
    if (!productData.sizes.includes(size)) {
      setProductData(prev => ({
        ...prev,
        sizes: [...prev.sizes, size]
      }));
    }
  };

  const handleRemoveSize = (size: string) => {
    setProductData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const handleFinish = () => {
    if (isFormValid()) {
      // Aquí guardarías el producto
      console.log('Producto creado:', productData);
      // Navegar de vuelta al dashboard o mostrar confirmación
      router.push('/(tabs)/');
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
                Toca para agregar fotos del producto
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
        <Button
          variant="primary"
          onPress={handleFinish}
          disabled={!isFormValid()}
          style={[
            styles.finishButton,
            !isFormValid() && styles.disabledButton
          ]}
          className="bg-primary"
        >
          Finalizar
        </Button>
      </View>

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
});

export default DetalleProductoScreen;
