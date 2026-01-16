import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';
import { genders } from '@/utils/hardcode';

const SeleccionarGeneroScreen = () => {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<number | null>(null);

  // Filtrar los géneros para excluir "Más" (id: 7) y mapear con iconos apropiados
  const genderOptions = genders
    .filter(gender => gender.id !== 7) // Excluir "Más"
    .map(gender => {
      let icon = '👤'; // Icono por defecto
      
      switch (gender.name) {
        case 'Mujer':
          icon = '👩';
          break;
        case 'Hombre':
          icon = '👨';
          break;
        case 'Niña':
          icon = '👧';
          break;
        case 'Niño':
          icon = '👦';
          break;
        case 'Bebés':
          icon = '👶';
          break;
        default:
          icon = '👤';
          break;
      }
      
      return {
        id: gender.id,
        label: gender.name,
        icon
      };
    });

  const handleContinue = () => {
    if (selectedGender) {
      router.push({
        pathname: '/(dashboard)/subir-producto/tipo-articulo',
        params: { genderId: selectedGender.toString() }
      });
    }
  };

  const GenderCard = ({ gender }: { gender: typeof genderOptions[0] }) => (
    <View
      style={[
        styles.genderCard,
        selectedGender === gender.id && styles.selectedCard
      ]}
    >
      <Button
        variant={selectedGender === gender.id ? "primary" : "outline"}
        onPress={() => setSelectedGender(gender.id)}
        style={styles.genderButton}
      >
        <View style={styles.genderContent}>
          <Text style={styles.genderIcon}>{gender.icon}</Text>
          <Typography 
            variant="body" 
            className={selectedGender === gender.id ? 'text-white' : 'text-gray-700'}
          >
            {gender.label}
          </Typography>
        </View>
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Typography variant="h2" className="text-center text-gray-800 mb-8">
          Selecciona el género
        </Typography>
        
        <View style={styles.gendersContainer}>
          {genderOptions.map((gender) => (
            <GenderCard key={gender.id} gender={gender} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          onPress={handleContinue}
          disabled={!selectedGender}
          style={[
            styles.continueButton,
            !selectedGender && styles.disabledButton
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
  gendersContainer: {
    gap: spacing.xl,
  },
  genderCard: {
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
  genderButton: {
    minHeight: 70,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  genderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  genderIcon: {
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

export default SeleccionarGeneroScreen;
