import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';

const ElegirOpcionScreen = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = [
    {
      id: 'talle-unico-varios-colores',
      title: 'Talle único, varios colores',
      description: 'Un solo talle con múltiples opciones de color',
      icon: '🎨'
    },
    {
      id: 'varios-talles-unico-color',
      title: 'Varios talles, único color',
      description: 'Múltiples talles en un solo color',
      icon: '📏'
    }
  ];

  const handleContinue = () => {
    if (selectedOption) {
      router.push('/(dashboard)/subir-producto/seleccionar-genero');
    }
  };

  const OptionCard = ({ option }: { option: typeof options[0] }) => (
    <View
      style={[
        styles.optionCard,
        selectedOption === option.id && styles.selectedCard
      ]}
    >
      <Button
        variant={selectedOption === option.id ? "primary" : "outline"}
        onPress={() => setSelectedOption(option.id)}
        style={styles.optionButton}
      >
        <View style={styles.optionContent}>
          <Text style={styles.optionIcon}>{option.icon}</Text>
          <View style={styles.textContainer}>
            <Typography 
              variant="h3" 
              className={selectedOption === option.id ? 'text-white' : 'text-gray-800'}
            >
              {option.title}
            </Typography>
            <Typography 
              variant="caption" 
              className={selectedOption === option.id ? 'text-gray-100' : 'text-gray-600'}
            >
              {option.description}
            </Typography>
          </View>
        </View>
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Typography variant="h2" className="text-center text-gray-800 mb-8">
          Elige una opción
        </Typography>
        
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <OptionCard key={option.id} option={option} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          onPress={handleContinue}
          disabled={!selectedOption}
          style={[
            styles.continueButton,
            !selectedOption && styles.disabledButton
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
  optionsContainer: {
    gap: spacing.xl,
  },
  optionCard: {
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
  optionButton: {
    minHeight: 100,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  optionIcon: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    gap: spacing.xs,
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

export default ElegirOpcionScreen;
