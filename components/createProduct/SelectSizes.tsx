import React, { useState, useEffect } from 'react';
import { 
  View, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList 
} from 'react-native';
import { Typography } from '@/components/ui';
import { useSizes } from '@/hooks/useSizes';
import { Size } from '@/store/slices/sizeSlice';
import { spacing, borderRadius } from '@/constants/Styles';

interface SelectSizesProps {
  visible: boolean;
  onClose: () => void;
  selectedSizes: number[];
  onSelectionChange: (sizes: number[]) => void;
}

type SizeType = 'Numéricos' | 'Alfanuméricos';

const SelectSizes: React.FC<SelectSizesProps> = ({
  visible,
  onClose,
  selectedSizes,
  onSelectionChange
}) => {
  const { sizes, loading, error, fetchSizes } = useSizes();
  const [activeTab, setActiveTab] = useState<SizeType>('Numéricos');

  useEffect(() => {
    if (visible && Object.keys(sizes).length === 0) {
      fetchSizes();
    }
  }, [visible]);

  // Obtener tamaños de la pestaña activa
  const currentSizes = sizes[activeTab] || [];

  const handleSizeToggle = (sizeId: number) => {
    if (selectedSizes.includes(sizeId)) {
      // Deseleccionar
      onSelectionChange(selectedSizes.filter(s => s !== sizeId));
    } else {
      // Seleccionar
      onSelectionChange([...selectedSizes, sizeId]);
    }
  };

  const renderSizeItem = ({ item }: { item: Size }) => {
    const isSelected = selectedSizes.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.sizeItem, isSelected && styles.selectedSizeItem]}
        onPress={() => handleSizeToggle(item.id)}
      >
        <View style={styles.sizeItemContent}>
          <Typography variant="body" className="text-gray-800 flex-1">
            {item.name}
          </Typography>
          {isSelected && (
            <View style={styles.checkmark}>
              <Typography variant="caption" className="text-white font-bold">
                ✓
              </Typography>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSelectedSize = (sizeId: number, index: number) => {
    // Buscar el nombre del talle por su ID
    const size = currentSizes.find(s => s.id === sizeId);
    if (!size) return null;
    
    return (
      <TouchableOpacity
        key={index}
        style={styles.selectedChip}
        onPress={() => handleSizeToggle(sizeId)}
      >
        <View style={styles.selectedChipContent}>
          <Typography variant="caption" className="text-gray-700 mr-2">
            {size.name}
          </Typography>
          <Typography variant="caption" className="text-red-500 font-bold">
            ✕
          </Typography>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabButton = (tab: SizeType) => {
    const isActive = activeTab === tab;
    
    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tabButton, isActive && styles.activeTabButton]}
        onPress={() => setActiveTab(tab)}
      >
        <Typography 
          variant="body" 
          className={isActive ? "text-orange-500 font-semibold" : "text-gray-600"}
        >
          {tab}
        </Typography>
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
            Seleccionar talles
          </Typography>
          
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Typography variant="body" className="text-orange-500 font-semibold">
              Guardar
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['Numéricos', 'Alfanuméricos'] as SizeType[]).map(renderTabButton)}
        </View>

        {/* Selected Sizes */}
        {selectedSizes.length > 0 && (
          <View style={styles.selectedSection}>
            <Typography variant="h4" className="text-gray-700 mb-3">
              Talles seleccionados ({selectedSizes.length})
            </Typography>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectedContainer}
            >
              {selectedSizes.map((sizeName, index) => 
                renderSelectedSize(sizeName, index)
              )}
            </ScrollView>
          </View>
        )}

        {/* Sizes List */}
        <View style={styles.sizesSection}>
          <Typography variant="h4" className="text-gray-700 mb-3">
            Talles {activeTab.toLowerCase()}
          </Typography>
          
          {loading ? (
            <View style={styles.centerContent}>
              <Typography variant="body" className="text-gray-500">
                Cargando talles...
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
              data={currentSizes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderSizeItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sizesList}
              numColumns={4}
              columnWrapperStyle={styles.row}
              ListEmptyComponent={
                <View style={styles.centerContent}>
                  <Typography variant="body" className="text-gray-500 text-center">
                    No hay talles {activeTab.toLowerCase()} disponibles
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#f97316',
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
  sizesSection: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sizesList: {
    paddingBottom: spacing.lg,
  },
  row: {
    justifyContent: 'space-around',
  },
  sizeItem: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flex: 0.23,
  },
  selectedSizeItem: {
    borderColor: '#f97316',
    backgroundColor: '#fff7ed',
  },
  sizeItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.lg,
    justifyContent: 'center',
  },
  checkmark: {
    backgroundColor: '#f97316',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: spacing.xs,
    top: spacing.xs,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
});


export default SelectSizes;