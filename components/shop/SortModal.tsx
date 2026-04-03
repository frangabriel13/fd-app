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
      <Pressable style={styles.sheet} onPress={() => {}}>

        {/* Handle */}
        <View style={styles.handle} />

        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Ordenar por</Text>
          <Pressable style={styles.closeButton} onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={18} color={Colors.gray.semiDark} />
          </Pressable>
        </View>

        {/* Opciones */}
        <View style={styles.optionsList}>
          {SORT_OPTIONS.map((option, index) => {
            const isActive = selectedSort === option.value;
            const isLast = index === SORT_OPTIONS.length - 1;
            return (
              <Pressable
                key={option.value}
                style={({ pressed }) => [
                  styles.option,
                  isActive && styles.optionActive,
                  pressed && !isActive && styles.optionPressed,
                ]}
                onPress={() => onSortChange(option.value)}
              >
                <View style={[styles.optionInner, !isLast && !isActive && styles.optionBorder]}>
                  {/* Ícono izquierdo */}
                  <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                    <Ionicons
                      name={option.icon as any}
                      size={16}
                      color={isActive ? Colors.orange.dark : Colors.gray.semiDark}
                    />
                  </View>

                  {/* Etiqueta */}
                  <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                    {option.label}
                  </Text>

                  {/* Indicador derecho */}
                  {isActive ? (
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={13} color="#fff" />
                    </View>
                  ) : (
                    <View style={styles.emptyCircle} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 36,
  },

  // — Handle —
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },

  // — Encabezado —
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.blue.dark,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // — Lista de opciones —
  optionsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  option: {
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  optionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionActive: {
    backgroundColor: '#fff7ed',
  },
  optionPressed: {
    backgroundColor: Colors.gray.light,
  },

  // — Ícono —
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: Colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#fff7ed',
  },

  // — Texto —
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  optionTextActive: {
    fontWeight: '700',
    color: Colors.orange.dark,
  },

  // — Indicador —
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.orange.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
  },
});

export default SortModal;
