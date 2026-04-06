import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/hooks/redux';
import { Colors } from '@/constants/Colors';

const ROLE_LABEL: Record<string, string> = {
  wholesaler:   'Mayorista',
  manufacturer: 'Fabricante',
  admin:        'Administrador',
};

const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const DataProfile = () => {
  const router    = useRouter();
  const user      = useAppSelector((state) => state.auth?.user);
  const initials  = user?.name ? getInitials(user.name) : null;
  const roleLabel = user?.role ? (ROLE_LABEL[user.role] ?? user.role) : null;

  const handlePress = () => {
    if (user?.role === 'manufacturer') {
      router.push('/(dashboard)/perfil' as any);
    } else {
      router.push('/(tabs)/mi-cuenta');
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatar}>
          {initials
            ? <Text style={styles.initials}>{initials}</Text>
            : <Ionicons name="person" size={28} color="#fff" />
          }
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.email} numberOfLines={1}>
            {user?.email ?? '—'}
          </Text>
          {roleLabel && (
            <Text style={styles.role}>{roleLabel}</Text>
          )}
        </View>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pressed: {
    backgroundColor: '#f9fafb',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.blue.dark,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  email: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  role: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default DataProfile;
