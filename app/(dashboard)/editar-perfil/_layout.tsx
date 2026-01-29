import { Stack, useRouter } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { Typography } from '@/components/ui';
import { spacing } from '@/constants/Styles';

const EditProfileHeader = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 0 }]} className='bg-primary'>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Feather name="arrow-left" size={28} color="white" />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Typography variant="h3" className="text-white font-mont-medium">
          Editar Perfil
        </Typography>
      </View>
      
      <View style={styles.spacer} />
    </View>
  );
};

export default function EditProfileLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#f3f4f6" }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <EditProfileHeader />,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
  },
  backButton: {
    padding: spacing.xs,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: {
    width: 40,
  },
});
