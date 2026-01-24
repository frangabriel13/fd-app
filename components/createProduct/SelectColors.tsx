import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Modal, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  FlatList 
} from 'react-native';
import { Typography, Button } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { Color } from '@/store/slices/colorSlice';
import { spacing, borderRadius } from '@/constants/Styles';

const { height: screenHeight } = Dimensions.get('window');

interface SelectColorsProps {
  visible: boolean;
  onClose: () => void;
  selectedColors: number[];
  onSelectionChange: (colors: number[]) => void;
}

const SelectColors: React.FC<SelectColorsProps> = ({
  visible,
  onClose,
  selectedColors,
  onSelectionChange
}) => {
  const { colors, loading, error, fetchColors } = useColors();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (visible && colors.length === 0) {
      fetchColors();
    }
  }, [visible]);

  // Filtrar colores basado en la búsqueda
  const filteredColors = useMemo(() => {
    if (!searchQuery.trim()) return colors;
    return colors.filter(color => 
      color.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [colors, searchQuery]);

  const handleColorToggle = (colorId: number) => {
    if (selectedColors.includes(colorId)) {
      // Deseleccionar
      onSelectionChange(selectedColors.filter(c => c !== colorId));
    } else {
      // Seleccionar
      onSelectionChange([...selectedColors, colorId]);
    }
  };

  const renderColorItem = ({ item }: { item: Color }) => {
    const isSelected = selectedColors.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.colorItem, isSelected && styles.selectedColorItem]}
        onPress={() => handleColorToggle(item.id)}
      >
        <View style={styles.colorItemContent}>
          <View 
            style={[
              styles.colorCircle, 
              { backgroundColor: item.code }
            ]} 
          />
          <Typography variant="body" className="text-gray-800 flex-1 ml-3">
            {item.name}
          </Typography>
          <Typography variant="caption" className="text-gray-500 mr-2">
            {item.code}
          </Typography>
          {isSelected && (
            <View style={styles.checkmark}>
              <Typography variant="body" className="text-white font-bold">
                ✓
              </Typography>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSelectedColor = (colorId: number, index: number) => {
    const color = colors.find(c => c.id === colorId);
    
    return (
      <TouchableOpacity
        key={index}
        style={styles.selectedChip}
        onPress={() => handleColorToggle(colorId)}
      >
        <View style={styles.selectedChipContent}>
          {color && (
            <View 
              style={[
                styles.selectedColorCircle, 
                { backgroundColor: color.code }
              ]} 
            />
          )}
          <Typography variant="caption" className="text-gray-700 mr-2">
            {color?.name || 'Color desconocido'}
          </Typography>
          <Typography variant="caption" className="text-red-500 font-bold">
            ✕
          </Typography>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Typography variant="body" className="text-gray-500">
              Cancelar
            </Typography>
          </TouchableOpacity>
          
          <Typography variant="h3" className="text-gray-800 text-center flex-1">
            Seleccionar colores
          </Typography>
          
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Typography variant="body" className="text-orange-500 font-semibold">
              Guardar
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar color por nombre..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            className="font-mont-regular text-gray-900"
          />
        </View>

        {/* Selected Colors */}
        {selectedColors.length > 0 && (
          <View style={styles.selectedSection}>
            <Typography variant="h4" className="text-gray-700 mb-3">
              Colores seleccionados ({selectedColors.length})
            </Typography>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectedContainer}
            >
              {selectedColors.map((colorId, index) => 
                renderSelectedColor(colorId, index)
              )}
            </ScrollView>
          </View>
        )}

        {/* Colors List */}
        <View style={styles.colorsSection}>
          <Typography variant="h4" className="text-gray-700 mb-3">
            Colores disponibles
          </Typography>
          
          {loading ? (
            <View style={styles.centerContent}>
              <Typography variant="body" className="text-gray-500">
                Cargando colores...
              </Typography>
            </View>
          ) : error ? (
            <View style={styles.centerContent}>
              <Typography variant="body" className="text-red-500 text-center">
                Error: {error}
              </Typography>
            </View>
          ) : (
            <FlatList
              data={filteredColors}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderColorItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.colorsList}
              ListEmptyComponent={
                <View style={styles.centerContent}>
                  <Typography variant="body" className="text-gray-500 text-center">
                    {searchQuery ? 'No se encontraron colores' : 'No hay colores disponibles'}
                  </Typography>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    paddingVertical: spacing.sm,
  },
  saveButton: {
    paddingVertical: spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#f9fafb',
    fontSize: 16,
  },
  selectedSection: {
    backgroundColor: '#fff',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectedContainer: {
    gap: spacing.sm,
  },
  selectedChip: {
    backgroundColor: '#f3f4f6',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
  },
  selectedChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedColorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  colorsSection: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  colorsList: {
    paddingBottom: spacing.lg,
  },
  colorItem: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedColorItem: {
    borderColor: '#f97316',
    backgroundColor: '#fff7ed',
  },
  colorItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkmark: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
});

export default SelectColors;