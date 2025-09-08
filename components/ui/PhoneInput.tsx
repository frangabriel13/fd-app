import React, { useState } from 'react';
import { View, StyleSheet, TextInputProps, TouchableOpacity, Text, TextInput, Modal, FlatList } from 'react-native';
import { BodyText } from './Typography';

// Lista de países más comunes con sus códigos
const COUNTRIES = [
  { code: 'AR', name: 'Argentina', callingCode: '+54', flag: '🇦🇷' },
  { code: 'US', name: 'Estados Unidos', callingCode: '+1', flag: '🇺🇸' },
  { code: 'MX', name: 'México', callingCode: '+52', flag: '🇲🇽' },
  { code: 'ES', name: 'España', callingCode: '+34', flag: '🇪🇸' },
  { code: 'BR', name: 'Brasil', callingCode: '+55', flag: '🇧🇷' },
  { code: 'CL', name: 'Chile', callingCode: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', callingCode: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Perú', callingCode: '+51', flag: '🇵🇪' },
  { code: 'UY', name: 'Uruguay', callingCode: '+598', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguay', callingCode: '+595', flag: '🇵🇾' },
];

interface PhoneInputProps extends Omit<TextInputProps, 'keyboardType'> {
  label?: string;
  error?: string;
  defaultCountryCode?: string;
  onPhoneChange?: (fullPhone: string, countryCode: string, phone: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  error,
  defaultCountryCode = 'AR',
  value,
  onChangeText,
  onPhoneChange,
  style,
  ...props
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES.find(c => c.code === defaultCountryCode) || COUNTRIES[0]
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Extraer solo el número sin el código de país del value
  const phoneNumber = value ? value.replace(/^\+\d+\s?/, '') : '';

  const handleSelectCountry = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
    
    // Si hay un número, actualizar con el nuevo código de país
    if (phoneNumber && onPhoneChange) {
      const fullPhone = `${country.callingCode} ${phoneNumber}`;
      onPhoneChange(fullPhone, country.callingCode, phoneNumber);
    }
  };

  const handleChangeText = (text: string) => {
    // Limpiar el texto para que solo contenga números y espacios
    const cleanText = text.replace(/[^\d\s]/g, '');
    const fullPhone = `${selectedCountry.callingCode} ${cleanText}`.trim();
    
    console.log('Texto ingresado:', text);
    console.log('Texto limpio:', cleanText);
    console.log('Teléfono completo:', fullPhone);
    
    if (onChangeText) {
      onChangeText(fullPhone);
    }
    
    if (onPhoneChange) {
      onPhoneChange(fullPhone, selectedCountry.callingCode, cleanText);
    }
  };

  const renderCountryItem = ({ item }: { item: typeof COUNTRIES[0] }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleSelectCountry(item)}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.countryCallingCode}>{item.callingCode}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      {label && <BodyText style={styles.label}>{label}</BodyText>}
      
      <View style={[styles.container, error && styles.containerError]}>
        {/* Selector de país */}
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => setShowCountryPicker(true)}
        >
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.callingCode}>{selectedCountry.callingCode}</Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>

        {/* Input para el número */}
        <TextInput
          style={styles.phoneInput}
          // placeholder="Número de teléfono"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handleChangeText}
          {...props}
        />
      </View>

      {/* Error message */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar país</Text>
              <TouchableOpacity
                onPress={() => setShowCountryPicker(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.countriesContainer}>
              <FlatList
                data={COUNTRIES}
                keyExtractor={(item) => item.code}
                renderItem={renderCountryItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 2,
  },
  label: {
    marginBottom: 2,
  },
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  containerError: {
    borderColor: 'red',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
    backgroundColor: '#f9f9f9',
    minWidth: 100,
  },
  flag: {
    fontSize: 18,
    marginRight: 8,
  },
  callingCode: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  arrow: {
    marginLeft: 4,
    fontSize: 10,
    color: '#666',
  },
  phoneInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%', // Cambiado de maxHeight a height
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  countriesList: {
    flex: 1,
    paddingHorizontal: 0, // Asegurar que no haya padding extra
  },
  countriesContainer: {
    flex: 1,
    paddingTop: 0,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  countryName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  countryCallingCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
