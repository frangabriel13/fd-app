import React from 'react'; // Importa React explícitamente
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { BodyText, Caption } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <BodyText>{label}</BodyText>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        {...props}
      />
      {error && <Caption>{error}</Caption>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  input: {
    height: 48, // Altura del input
    borderWidth: 1, // Borde del input
    borderColor: '#ccc', // Color del borde
    borderRadius: 6, // Bordes redondeados
    paddingHorizontal: 12, // Relleno interno horizontal
    fontSize: 16, // Tamaño de fuente
    backgroundColor: '#fff', // Fondo blanco
  },
  inputError: {
    borderColor: 'red', // Cambia el color del borde si hay un error
  },
  error: {
    color: 'red', // Color del texto del error
  },
});