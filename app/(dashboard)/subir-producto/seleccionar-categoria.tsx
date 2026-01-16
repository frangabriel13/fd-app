import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';
import { parentCategories } from '@/utils/hardcode';

const SeleccionarCategoriaScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Mapear las categorías con iconos apropiados
  const categories = parentCategories.map(category => {
    let icon = '📦'; // Icono por defecto
    
    switch (category.name) {
      case 'Indumentaria':
        icon = '👕';
        break;
      case 'Blanquería':
        icon = '🛏️';
        break;
      case 'Bisutería':
        icon = '💍';
        break;
      case 'Artículos de confección':
        icon = '✂️';
        break;
      default:
        icon = '📦';
        break;
    }
    
    return {
      id: category.id,
      label: category.name,
      icon
    };
  });

  const handleContinue = () => {
    if (selectedCategory) {
      // Si se selecciona "Indumentaria" (id: 88), sigue el flujo normal
      if (selectedCategory === 88) {
        router.push('/(dashboard)/subir-producto/elegir-opcion');
      } else {
        // Para cualquier otra categoría, va directamente a detalles del producto
        router.push('/(dashboard)/subir-producto/detalle-producto');
      }
    }
  };

  const CategoryCard = ({ category }: { category: typeof categories[0] }) => (
    <View
      style={[
        styles.categoryCard,
        selectedCategory === category.id && styles.selectedCard
      ]}
    >
      <Button
        variant={selectedCategory === category.id ? "primary" : "outline"}
        onPress={() => setSelectedCategory(category.id)}
        style={styles.categoryButton}
      >
        <View style={styles.categoryContent}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Typography 
            variant="caption" 
            className={selectedCategory === category.id ? 'text-white text-center' : 'text-gray-700 text-center'}
            style={styles.categoryLabel}
          >
            {category.label}
          </Typography>
        </View>
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Typography variant="h2" className="text-center text-gray-800 mb-8">
          Elige la categoría de tu producto
        </Typography>
        
        <View style={styles.categoriesContainer}>
          <View style={styles.row}>
            {categories.slice(0, 2).map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </View>
          <View style={styles.row}>
            {categories.slice(2, 4).map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </View>
          {/* Agregar más filas si hay más de 4 categorías */}
          {categories.length > 4 && (
            <View style={styles.row}>
              {categories.slice(4).map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          onPress={handleContinue}
          disabled={!selectedCategory}
          style={[
            styles.continueButton,
            !selectedCategory && styles.disabledButton
          ]}
          className="bg-primary"
        >
          Continuar
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
    paddingBottom: spacing.xl,
  },
  categoriesContainer: {
    gap: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  categoryCard: {
    flex: 1,
    aspectRatio: 1, // Hace que sea cuadrado
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.orange.light,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  selectedCard: {
    borderColor: Colors.orange.light,
    backgroundColor: Colors.orange.light,
  },
  categoryButton: {
    flex: 1,
    // borderRadius: borderRadius.lg,
    height: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryLabel: {
    fontSize: 18,
    // lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  continueButton: {
    minHeight: 50,
  },
  disabledButton: {
    opacity: 0.5,
  },
});


export default SeleccionarCategoriaScreen;