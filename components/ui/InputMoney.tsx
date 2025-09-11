import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { BodyText, Caption } from './Typography';

interface InputMoneyProps extends Omit<TextInputProps, 'keyboardType'> {
  label?: string;
  error?: string;
}

export const InputMoney: React.FC<InputMoneyProps> = ({
  label,
  error,
  value,
  onChangeText,
  style,
  ...props
}) => {
  return (
    <View style={styles.wrapper}>
      {label && <BodyText style={styles.label}>{label}</BodyText>}
      
      <View style={[styles.container, error && styles.containerError]}>
        {/* Signo de pesos fijo */}
        <View style={styles.prefix}>
          <BodyText style={styles.prefixText}>$</BodyText>
        </View>

        {/* Input editable */}
        <TextInput
          style={[styles.input, style]}
          className="font-mont-regular"
          keyboardType="numeric"
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
      </View>

      {/* Mensaje de error */}
      {error && <Caption style={styles.error}>{error}</Caption>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 2,
  },
  label: {
    marginBottom: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  containerError: {
    borderColor: 'red',
  },
  prefix: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
  },
  prefixText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    // color: '#333',
  },
  error: {
    color: 'red',
    marginTop: 4,
  },
});