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
    { id: 'otro', label: 'Otro', icon: '📦' },
    { id: 'sudadera', label: 'Sudadera', icon: '�' },
    { id: 'falda', label: 'Falda', icon: '👗' },
    { id: 'shorts', label: 'Shorts', icon: '🩳' },
    { id: 'medias', label: 'Medias', icon: '�' },
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
    >
      <Button
        variant={selectedType === type.id ? "primary" : "outline"}
        onPress={() => setSelectedType(type.id)}
        style={styles.typeButton}
      >
        <View style={styles.typeContent}>
          <Text style={styles.typeIcon}>{type.icon}</Text>
          <Typography 
            variant="caption" 
            className={selectedType === type.id ? 'text-white text-center' : 'text-gray-700 text-center'}
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
        <Typography variant="h2" className="text-center text-gray-800 mb-8">
          Tipo de artículo
        </Typography>
        
        <View style={styles.typesContainer}>
          {Array.from({ length: Math.ceil(articleTypes.length / 3) }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {articleTypes.slice(rowIndex * 3, (rowIndex + 1) * 3).map((type) => (
                <TypeCard key={type.id} type={type} />
              ))}
            </View>
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
    paddingBottom: spacing.xl,
  },
  typesContainer: {
    gap: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  typeCard: {
    flex: 1,
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
  typeButton: {
    minHeight: 70,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  typeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  typeIcon: {
    fontSize: 32,
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
