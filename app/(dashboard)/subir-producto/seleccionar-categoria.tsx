import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';

const SeleccionarCategoriaScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'ropa', label: 'Indumentaria', icon: '👕' },
    { id: 'calzado', label: 'Blanquería', icon: '�️' },
    { id: 'accesorios', label: 'Bisutería', icon: '�' },
    { id: 'bijouterie', label: 'Lencería', icon: '�' },
    { id: 'textil', label: 'Calzados', icon: '👟' },
    { id: 'otros', label: 'Artículos de confección', icon: '✂️' }
  ];

  const handleContinue = () => {
    if (selectedCategory) {
      router.push('/(dashboard)/subir-producto/elegir-opcion');
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
        <Typography variant="h2" className="text-center text-gray-800 mb-2">
          Selecciona una categoría
        </Typography>
        
        <Typography variant="body2" className="text-center text-gray-600 mb-8">
          Elige la categoría que mejor describa tu producto
        </Typography>
        
        <View style={styles.categoriesContainer}>
          <View style={styles.row}>
            <CategoryCard category={categories[0]} />
            <CategoryCard category={categories[1]} />
          </View>
          <View style={styles.row}>
            <CategoryCard category={categories[2]} />
            <CategoryCard category={categories[3]} />
          </View>
          <View style={styles.row}>
            <CategoryCard category={categories[4]} />
            <CategoryCard category={categories[5]} />
          </View>
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
  },
  categoriesContainer: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  categoryCard: {
    flex: 1,
    aspectRatio: 1, // Hace que sea cuadrado
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: Colors.blue.default,
  },
  categoryButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    height: '100%',
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
    fontSize: 12,
    lineHeight: 14,
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