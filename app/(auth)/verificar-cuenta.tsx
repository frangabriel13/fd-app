// import { View, Text, StyleSheet } from 'react-native';

// const VerifyAccountScreen = () => {
//   return (
//     <View style={styles.container}>
//       <Text>VerifyAccountScreen</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 0,
//   },
// });


// export default VerifyAccountScreen;
import { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button, Container, H1 } from '@/components/ui';
import { Typography } from '@/components/ui/Typography';

const VerifyAccountScreen = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (value: string, index: number) => {
    if (value.length > 1) return; // Solo permitir un carácter por input
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Mover el foco al siguiente input automáticamente
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    if (code.some((digit) => digit === '')) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const verificationCode = code.join('');
      console.log('Código de verificación:', verificationCode);

      // Aquí puedes agregar la lógica para verificar el código
      // Ejemplo: await dispatch(verifyAccount(verificationCode)).unwrap();

      router.replace('/(tabs)'); // Navegar si la verificación es exitosa
    } catch (err: any) {
      setError(err.message || 'Error al verificar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container type="page" className="justify-center bg-primary">
      <H1 className="text-center mb-8 text-white">Verificar Cuenta</H1>

      {/* Mostrar errores si existen */}
      {error && (
        <Typography variant="body" className="text-red-500 mb-4 text-center">
          {error}
        </Typography>
      )}

      {/* Inputs para los 6 dígitos */}
      <View className="flex-row justify-center mb-6">
        {code.map((digit, index) => (
          <TextInput
            key={index}
            id={`digit-${index}`}
            value={digit}
            onChangeText={(value) => handleInputChange(value, index)}
            keyboardType="numeric"
            maxLength={1}
            className="border border-gray-200 bg-white rounded-md text-center text-lg font-mont-medium mx-2 w-12 h-12 text-gray-900"
          />
        ))}
      </View>

      <Button
        variant="primary"
        onPress={handleVerify}
        loading={loading}
        className="rounded-md bg-secondary"
      >
        Verificar Cuenta
      </Button>
    </Container>
  );
};


export default VerifyAccountScreen;