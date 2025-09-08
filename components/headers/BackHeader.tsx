import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useRouter, usePathname } from 'expo-router';

const BackHeader = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const inOnRoleScreen = pathname === '/rol';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 0 }]} className='bg-primary'>
      <TouchableOpacity
        onPress={() => {
          if(!inOnRoleScreen) {
            router.back();
          }
        }}
        style={[styles.backButton, inOnRoleScreen && styles.disabledButton]}
        disabled={inOnRoleScreen}
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