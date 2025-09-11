import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { BodyText, Caption } from './Typography';

interface InputSelectProps {
  label?: string;
  error?: string;
  options: { label: string; value: string }[]; // Opciones del select
  value?: string; // Valor seleccionado
  onValueChange?: (value: string) => void; // Callback al cambiar el valor
}

export const InputSelect: React.FC<InputSelectProps> = ({ label, error, options, value, onValueChange }) => {
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (selectedValue: string) => {
    setShowModal(false);
    if (onValueChange) {
      onValueChange(selectedValue);
    }
  };

  const renderOption = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity style={styles.option} onPress={() => handleSelect(item.value)}>
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && <BodyText>{label}</BodyText>}
      <TouchableOpacity
        style={[styles.select, error && styles.selectError]}
        onPress={() => setShowModal(true)}
      >
        <Text style={value ? styles.selectedText : styles.placeholder}>
          {value ? options.find((option) => option.value === value)?.label : 'Seleccionar...'}
        </Text>
      </TouchableOpacity>
      {error && <Caption style={styles.error}>{error}</Caption>}

      {/* Modal para mostrar las opciones */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={renderOption}
              contentContainerStyle={styles.optionsList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  select: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  selectError: {
    borderColor: 'red',
  },
  placeholder: {
    color: '#aaa',
  },
  selectedText: {
    color: '#333',
  },
  error: {
    color: 'red',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  optionsList: {
    gap: 8,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});