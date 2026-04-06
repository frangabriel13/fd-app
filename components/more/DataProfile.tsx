import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BodyText, Card, H3 } from '../ui';
import { useAppSelector } from '@/hooks/redux';

const DataProfile = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const handlePress = () => {
    const route = user?.role === 'manufacturer'
      ? '/(dashboard)/perfil'
      : '/(tabs)/mi-cuenta';
    router.push(route);
  };

  return (
    <Pressable onPress={handlePress}>
      <Card variant="default" className="bg-secondary-400">
        <H3 className="text-white">{user?.name ?? 'Mi cuenta'}</H3>
        <View style={styles.footer}>
          <BodyText className="text-white">{user?.email ?? ''}</BodyText>
          <Ionicons name="chevron-forward" size={14} color="white" />
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
});

export default DataProfile;
