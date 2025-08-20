import React from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui';

const ForgotPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Texto de ejemplo</Text>
      <Button 
        variant="ghost" 
        onPress={() => router.back()}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ForgotPasswordScreen;