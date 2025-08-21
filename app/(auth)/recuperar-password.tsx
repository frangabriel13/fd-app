import { useState } from 'react';
import { router } from 'expo-router';
import { TextInput } from 'react-native';
import { Button, Container, H1 } from '@/components/ui';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  // const [loading, setLoading] = useState(false);



  return (
    <Container type="page" className="justify-center bg-primary">
      <H1 className="text-center mb-8 text-white">Recuperar Contraseña</H1>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#9CA3AF"
        className="border border-gray-200 bg-white rounded-md px-4 py-3 mb-4 font-mont-regular text-gray-900"
      />

      <Button 
        variant="primary" 
        // onPress={handleLogin}
        // loading={loading}
        className="mb-4 rounded-md bg-secondary"
      >
        Enviar
      </Button>

      <Button 
        variant="ghost"
        // size='zero'
        onPress={() => router.push('/(auth)/login')}
        className="text-white"
      >
        Volver
      </Button>
    </Container>
  );
};

// const styles = StyleSheet.create({
// });

export default ForgotPasswordScreen;