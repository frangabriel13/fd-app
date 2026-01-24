import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button, Typography } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';
import { genders } from '@/utils/hardcode';

const TipoArticuloScreen = () => {
  const router = useRouter();
  const { genderId, isVariable } = useLocalSearchParams<{ genderId: string; isVariable: string }>();

  // Obtener el género seleccionado y sus categorías
  const selectedGender = genders.find(gender => gender.id === parseInt(genderId || '0'));
  const categories = selectedGender?.categories || [];
  
  // Mapear las categorías con iconos apropiados
  const articleTypes = categories.map(category => {
    let icon = '📦'; // Icono por defecto
    
    const categoryName = category.name.toLowerCase();
    
    if (categoryName.includes('jean')) icon = '👖';
    else if (categoryName.includes('pantalon') || categoryName.includes('calza')) icon = '👖';
    else if (categoryName.includes('bermuda') || categoryName.includes('short')) icon = '🩳';
    else if (categoryName.includes('campera') || categoryName.includes('abrigo')) icon = '🧥';
    else if (categoryName.includes('remera')) icon = '👕';
    else if (categoryName.includes('camisa')) icon = '👔';
    else if (categoryName.includes('chomba')) icon = '👕';
    else if (categoryName.includes('buzo')) icon = '👘';
    else if (categoryName.includes('sweater')) icon = '🧥';
    else if (categoryName.includes('vestido')) icon = '👗';
    else if (categoryName.includes('pollera')) icon = '👗';
    else if (categoryName.includes('interior') || categoryName.includes('lenceria') || categoryName.includes('malla')) icon = '🩲';
    else if (categoryName.includes('calzado')) icon = '👟';
    else if (categoryName.includes('body')) icon = '👶';
    else if (categoryName.includes('conjunto')) icon = '👕';
    else if (categoryName.includes('enterizo')) icon = '👶';
    else if (categoryName.includes('media')) icon = '🧦';
    else if (categoryName.includes('accesorio')) icon = '👜';
    else icon = '📦';
    
    return {
      id: category.id,
      label: category.name,
      icon
    };
  });

  const handleTypeSelect = (typeId: number) => {
    router.push({
      pathname: '/(dashboard)/subir-producto/detalle-producto',
      params: {
        categoryId: typeId.toString(),
        genderId: genderId || '',
        isVariable: isVariable || 'false'
      }
    });
  };

  const TypeCard = ({ type }: { type: typeof articleTypes[0] }) => (
    <View style={styles.typeCard}>
      <Button
        variant="outline"
        onPress={() => handleTypeSelect(type.id)}
        style={styles.typeButton}
      >
        <View style={styles.typeContent}>
          <Text style={styles.typeIcon}>{type.icon}</Text>
          <Typography 
            variant="caption" 
            className="text-gray-700 text-center"
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
          Tipo de artículo - {selectedGender?.name || 'Género'}
        </Typography>
        
        <View style={styles.typesContainer}>
          {articleTypes.length > 0 ? (
            Array.from({ length: Math.ceil(articleTypes.length / 3) }, (_, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {articleTypes.slice(rowIndex * 3, (rowIndex + 1) * 3).map((type) => (
                  <TypeCard key={type.id} type={type} />
                ))}
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Typography variant="body" className="text-center text-gray-500">
                No hay categorías disponibles para este género
              </Typography>
            </View>
          )}
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
  noDataContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});

export default TipoArticuloScreen;
