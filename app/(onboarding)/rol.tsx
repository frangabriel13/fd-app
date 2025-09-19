import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H2 } from '@/components/ui';
import RoleCard from '@/components/register/RoleCard';
import Images from '@/constants/Images';

const RoleSelectionScreen = () => {
  const [selectedRole, setSelectedRole] = useState<'mayorista' | 'fabricante' | null>(null);

  const handleContinue = () => {
    if(!selectedRole) {
      Alert.alert('Error', 'Por favor selecciona un rol');
      return;
    }

    if(selectedRole === 'mayorista') {
      // router.push('/(onboarding)/datos-mayorista');
      router.push('/(tabs)');
    } else {
      router.push('/(onboarding)/datos-fabricante');
    }
  };

  return (
    <Container type="page" style={styles.container}>
      <View style={styles.content}>
        <H2>Elige una de las dos opciones</H2>

        <RoleCard
          role="mayorista"
          title="Mayorista"
          image={Images.roleImages.wholesaler}
          onPress={() => setSelectedRole('mayorista')}
          isSelected={selectedRole === 'mayorista'}
        />
        <RoleCard
          role="fabricante"
          title="Fabricante"
          image={Images.roleImages.manufacturer}
          onPress={() => setSelectedRole('fabricante')}
          isSelected={selectedRole === 'fabricante'}
        />
      </View>

      <Button
        variant="primary"
        onPress={handleContinue}
        disabled={!selectedRole}
        className="bg-primary"
      >
        Continuar
      </Button>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    gap: 30,
  },
});


export default RoleSelectionScreen;