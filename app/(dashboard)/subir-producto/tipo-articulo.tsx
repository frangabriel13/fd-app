import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';

const TipoArticuloScreen = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const articleTypes = [
    { id: 'remera', label: 'Remera', icon: '👕' },
    { id: 'pantalon', label: 'Pantalón', icon: '👖' },
    { id: 'vestido', label: 'Vestido', icon: '👗' },
    { id: 'zapatos', label: 'Zapatos', icon: '👟' },
    { id: 'abrigo', label: 'Abrigo', icon: '🧥' },
    { id: 'accesorio', label: 'Accesorio', icon: '👜' },
    { id: 'ropa-interior', label: 'Ropa interior', icon: '🩲' },
    { id: 'otro', label: 'Otro', icon: '📦' }
  ];

  const handleContinue = () => {
    if (selectedType) {
      router.push('/(dashboard)/subir-producto/detalle-producto');
    }
  };

  const TypeCard = ({ type }: { type: typeof articleTypes[0] }) => (
    <View
      style={[
        styles.typeCard,
        selectedType === type.id && styles.selectedCard
      ]}
      className={selectedType === type.id ? 'border-primary' : 'border-gray-300'}
    >
      <Button
        variant={selectedType === type.id ? "primary" : "outline"}
        onPress={() => setSelectedType(type.id)}
        style={styles.typeButton}
      >
        <View style={styles.typeContent}>
          <Text style={styles.typeIcon}>{type.icon}</Text>
          <Typography 
            variant="body1" 
            className={selectedType === type.id ? 'text-white' : 'text-gray-700'}
          >
            {type.label}
          </Typography>
        </View>
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Typography variant="h2" className="text-center text-gray-800 mb-2">
          Tipo de artículo
        </Typography>
        
        <Typography variant="body2" className="text-center text-gray-600 mb-8">
          ¿Qué tipo de artículo estás subiendo?
        </Typography>
        
        <View style={styles.typesContainer}>
          {articleTypes.map((type) => (
            <TypeCard key={type.id} type={type} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          onPress={handleContinue}
          disabled={!selectedType}
          style={[
            styles.continueButton,
            !selectedType && styles.disabledButton
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
  typesContainer: {
    gap: spacing.md,
  },
  typeCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: Colors.blue.default,
  },
  typeButton: {
    borderRadius: borderRadius.lg,
    minHeight: 70,
  },
  typeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  typeIcon: {
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

export default TipoArticuloScreen;
