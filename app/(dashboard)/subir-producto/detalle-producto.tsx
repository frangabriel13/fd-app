import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button, Typography, Input } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';

const DetalleProductoScreen = () => {
  const router = useRouter();
  const { categoryId, genderId, isVariable } = useLocalSearchParams<{
    categoryId?: string;
    genderId?: string;
    isVariable?: string;
  }>();
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    material: '',
    care: ''
  });

  // Consoleguear los parámetros recibidos
  useEffect(() => {
    console.log('=== PARÁMETROS RECIBIDOS EN DETALLE-PRODUCTO ===');
    console.log('categoryId:', categoryId);
    console.log('genderId:', genderId);
    console.log('isVariable:', isVariable);
    console.log('===============================================');
  }, [categoryId, genderId, isVariable]);

  const handleInputChange = (field: string, value: string) => {
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
            <Input
              placeholder="Ej: Remera básica de algodón"
              value={productData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="h4" className="text-gray-700 mb-2">
              Descripción *
            </Typography>
            <Input
              placeholder="Describe tu producto en detalle"
              value={productData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="h4" className="text-gray-700 mb-2">
              Precio *
            </Typography>
            <Input
              placeholder="0.00"
              value={productData.price}
              onChangeText={(value) => handleInputChange('price', value)}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="h4" className="text-gray-700 mb-2">
              Marca
            </Typography>
            <Input
              placeholder="Ej: Nike, Adidas, etc."
              value={productData.brand}
              onChangeText={(value) => handleInputChange('brand', value)}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="h4" className="text-gray-700 mb-2">
              Material
            </Typography>
            <Input
              placeholder="Ej: 100% algodón"
              value={productData.material}
              onChangeText={(value) => handleInputChange('material', value)}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="h4" className="text-gray-700 mb-2">
              Cuidados
            </Typography>
            <Input
              placeholder="Ej: Lavar a máquina, no usar lejía"
              value={productData.care}
              onChangeText={(value) => handleInputChange('care', value)}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
            />
          </View>
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
  input: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
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
