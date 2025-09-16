import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useRouter, usePathname } from 'expo-router';
import { useModal } from '@/contexts/ModalContext';

const BackHeader = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  
  // Usar el contexto solo si está disponible
  let isSuccessModalVisible = false;
  try {
    const modalContext = useModal();
    isSuccessModalVisible = modalContext.isSuccessModalVisible;
  } catch {
    // El contexto no está disponible, usar valor por defecto
    isSuccessModalVisible = false;
  }

  const inOnRoleScreen = pathname === '/rol';
  const inDatosMayoristaScreen = pathname === '/datos-mayorista';
  const inValidarDocumentosScreen = pathname === '/validar-documentos';
  const shouldDisableBack = inOnRoleScreen || (inDatosMayoristaScreen && isSuccessModalVisible) || inValidarDocumentosScreen;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 0 }]} className='bg-primary'>
      <TouchableOpacity
        onPress={() => {
          if(!shouldDisableBack) {
            router.back();
          }
        }}
        style={[styles.backButton, shouldDisableBack && styles.disabledButton]}
        disabled={shouldDisableBack}
      >
        <Feather name="arrow-left" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
});


export default BackHeader;