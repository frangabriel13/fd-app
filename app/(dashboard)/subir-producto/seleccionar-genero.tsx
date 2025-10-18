import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';

const SeleccionarGeneroScreen = () => {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const genders = [
    { id: 'mujer', label: 'Mujer', icon: '👩' },
    { id: 'hombre', label: 'Hombre', icon: '👨' },
    { id: 'niña', label: 'Niña', icon: '👧' },
    { id: 'niño', label: 'Niño', icon: '👦' },
    { id: 'bebes', label: 'Bebés', icon: '👶' }
  ];

  const handleContinue = () => {
    if (selectedGender) {
      router.push('/(dashboard)/subir-producto/tipo-articulo');
    }
  };

  const GenderCard = ({ gender }: { gender: typeof genders[0] }) => (
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
          {genders.map((gender) => (
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
