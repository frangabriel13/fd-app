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
    { id: 'ropa', label: 'Ropa', icon: '👕' },
    { id: 'calzado', label: 'Calzado', icon: '👟' },
    { id: 'accesorios', label: 'Accesorios', icon: '👜' },
    { id: 'bijouterie', label: 'Bijouterie', icon: '💍' },
    { id: 'textil', label: 'Textil', icon: '🧵' },
    { id: 'otros', label: 'Otros', icon: '📦' }
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
      className={selectedCategory === category.id ? 'border-primary' : 'border-gray-300'}
    >
      <Button
        variant={selectedCategory === category.id ? "primary" : "outline"}
        onPress={() => setSelectedCategory(category.id)}
        style={styles.categoryButton}
      >
        <View style={styles.categoryContent}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Typography 
            variant="body1" 
            className={selectedCategory === category.id ? 'text-white' : 'text-gray-700'}
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
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
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
    gap: spacing.md,
  },
  categoryCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: Colors.blue.default,
  },
  categoryButton: {
    borderRadius: borderRadius.lg,
    minHeight: 70,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  categoryIcon: {
    fontSize: 24,
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
