import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H1, H2, BodyText } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import RoleCard from '@/components/register/RoleCard';

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
    <Container type="page">
      <H1>Selecciona un rol</H1>

      <RoleCard
        role="mayorista"
        title="Mayorista"
        image="https://via.placeholder.com/150"
      />
      <RoleCard
        role="fabricante"
        title="Fabricante"
        image="https://via.placeholder.com/150"
      />

      <Button
        variant="primary"
        onPress={handleContinue}
        disabled={!selectedRole}
        className="mt-8 bg-primary"
      >
        Continuar
      </Button>
    </Container>
  );
};


export default RoleSelectionScreen;