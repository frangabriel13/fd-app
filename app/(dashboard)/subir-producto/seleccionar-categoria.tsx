import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';
import { parentCategories } from '@/utils/hardcode';

const SeleccionarCategoriaScreen = () => {
  const router = useRouter();

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
      case 'Packs':
        icon = '🎁';
        break;
      case 'Telas textiles':
        icon = '🧵';
        break;
      case 'Artículos de confección':
        icon = '✂️';
        break;
      case 'Máquinas-textiles':
        icon = '🧶';
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

  const handleCategorySelect = (categoryId: number) => {
    // Si se selecciona "Indumentaria" (id: 88), sigue el flujo normal
    if (categoryId === 88) {
      router.push('/(dashboard)/subir-producto/elegir-opcion');
    } else {
      // Para cualquier otra categoría, va directamente a detalles del producto
      router.push({
        pathname: '/(dashboard)/subir-producto/detalle-producto',
        params: { categoryId: categoryId.toString() }
      });
    }
  };

  const CategoryCard = ({ category }: { category: typeof categories[0] }) => (
    <View style={styles.categoryCard}>
      <Button
        variant="outline"
        onPress={() => handleCategorySelect(category.id)}
        style={styles.categoryButton}
      >
        <View style={styles.categoryContent}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Typography 
            variant="caption" 
            className="text-gray-700 text-center"
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Typography variant="h2" className="text-center text-gray-800 mb-8">
          Elige la categoría de tu producto
        </Typography>
        
        <View style={styles.categoriesContainer}>
          {Array.from({ length: Math.ceil(categories.length / 2) }, (_, rowIndex) => {
            const startIndex = rowIndex * 2;
            const rowCategories = categories.slice(startIndex, startIndex + 2);
            
            return (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {rowCategories.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
                {/* Añadir espacio vacío si solo hay una categoría en la fila */}
                {rowCategories.length === 1 && <View style={{ flex: 1 }} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
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
});


export default SeleccionarCategoriaScreen;