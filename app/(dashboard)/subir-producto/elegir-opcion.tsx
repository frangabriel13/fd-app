import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';

const ElegirOpcionScreen = () => {
  const router = useRouter();

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

  const handleOptionSelect = (optionId: string) => {
    // talle-unico-varios-colores = true (muestra colores)
    // varios-talles-unico-color = false (muestra talles)
    const isVariable = optionId === 'talle-unico-varios-colores';
    router.push({
      pathname: '/(dashboard)/subir-producto/seleccionar-genero',
      params: { isVariable: isVariable.toString() }
    });
  };

  const OptionCard = ({ option }: { option: typeof options[0] }) => (
    <View style={styles.optionCard}>
      <Button
        variant="outline"
        onPress={() => handleOptionSelect(option.id)}
        style={styles.optionButton}
      >
        <View style={styles.optionContent}>
          <Text style={styles.optionIcon}>{option.icon}</Text>
          <View style={styles.textContainer}>
            <Typography 
              variant="h3" 
              className="text-gray-800"
            >
              {option.title}
            </Typography>
            <Typography 
              variant="caption" 
              className="text-gray-600"
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
});

export default ElegirOpcionScreen;
