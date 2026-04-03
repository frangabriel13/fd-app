import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SortValue, SORT_OPTIONS } from '@/constants/shop';

interface SortModalProps {
  visible: boolean;
  selectedSort: SortValue;
  onClose: () => void;
  onSortChange: (sort: SortValue) => void;
}

const SortModal = ({ visible, selectedSort, onClose, onSortChange }: SortModalProps) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable style={styles.overlay} onPress={onClose}>
      {/* Pressable interno para evitar que el tap en el contenido cierre el modal */}
      <Pressable style={styles.content} onPress={() => {}}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Ordenar por</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.light.text} />
          </Pressable>
        </View>
        {SORT_OPTIONS.map((option) => {
          const isActive = selectedSort === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.option, isActive && styles.optionActive]}
              onPress={() => onSortChange(option.value)}
            >
              <Ionicons
                name={option.icon as any}
                size={20}
                color={isActive ? Colors.blue.dark : Colors.light.icon}
              />
              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                {option.label}
              </Text>
              {isActive && <Ionicons name="checkmark" size={20} color={Colors.blue.dark} />}
            </Pressable>
          );
        })}
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray.default,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
    backgroundColor: Colors.gray.light,
  },
  optionActive: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: Colors.blue.dark,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.light.text,
  },
  optionTextActive: {
    color: Colors.blue.dark,
    fontWeight: '600',
  },
});

export default SortModal;
