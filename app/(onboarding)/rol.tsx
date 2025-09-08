import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H1, H2, BodyText } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import RoleCard from '@/components/register/RoleCard';
import Images from '@/constants/Images';

const RoleSelectionScreen = () => {
  const [selectedRole, setSelectedRole] = useState<'mayorista' | 'fabricante'>(null);

  const handleContinue = () => {
    if(!selectedRole) {
      Alert.alert('Error', 'Por favor selecciona un rol');
      return;
    }

    if(selectedRole === 'mayorista') {
      router.push('/(onboarding)/datos-mayorista');
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    gap: 30,
  },
});


export default RoleSelectionScreen;