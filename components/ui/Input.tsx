import React from 'react'; // Importa React explícitamente
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
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
    marginBottom: 16, // Espaciado entre inputs
  },
  label: {
    marginBottom: 4, // Espaciado entre la etiqueta y el input
  },
  input: {
    height: 48, // Altura del input
    borderWidth: 1, // Borde del input
    borderColor: '#ccc', // Color del borde
    borderRadius: 8, // Bordes redondeados
    paddingHorizontal: 12, // Relleno interno horizontal
    fontSize: 16, // Tamaño de fuente
    backgroundColor: '#fff', // Fondo blanco
  },
  inputError: {
    borderColor: 'red', // Cambia el color del borde si hay un error
  },
  error: {
    marginTop: 4, // Espaciado entre el input y el mensaje de error
    color: 'red', // Color del texto del error
  },
});