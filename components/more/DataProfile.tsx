import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/hooks/redux';
import { Colors } from '@/constants/Colors';

const ROLE_LABEL: Record<string, string> = {
  wholesaler:   'Mayorista',
  manufacturer: 'Fabricante',
};

const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const DataProfile = () => {
  const router    = useRouter();
  const user      = useAppSelector((state) => state.auth.user);
  const initials  = user?.name ? getInitials(user.name) : null;
  const roleLabel = user?.role ? (ROLE_LABEL[user.role] ?? user.role) : null;

  const handlePress = () => {
    const route = user?.role === 'manufacturer'
      ? '/(dashboard)/perfil'
      : '/(tabs)/mi-cuenta';
    router.push(route);
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Pressable onPress={handlePress} style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          {initials
            ? <Text style={styles.initials}>{initials}</Text>
            : <Ionicons name="person" size={32} color="#fff" />
          }
        </View>
        <View style={styles.editBadge}>
          <Ionicons name="pencil" size={10} color="#fff" />
        </View>
      </Pressable>

      {/* Nombre y rol */}
      <Text style={styles.name}>{user?.name ?? 'Mi cuenta'}</Text>
      {roleLabel && (
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>{roleLabel}</Text>
        </View>
      )}
      {user?.email && (
        <Text style={styles.email}>{user.email}</Text>
      )}

      {/* CTA */}
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
      >
        <Text style={styles.editButtonText}>Ver perfil</Text>
        <Ionicons name="chevron-forward" size={14} color={Colors.blue.dark} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 6,
  },

  // — Avatar —
  avatarWrapper: {
    marginBottom: 4,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.blue.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 1,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.orange.dark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // — Info —
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  rolePill: {
    backgroundColor: Colors.blue.dark + '12',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  roleText: {
    color: Colors.blue.dark,
    fontSize: 12,
    fontWeight: '600',
  },
  email: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },

  // — CTA —
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  editButtonPressed: {
    backgroundColor: '#f9fafb',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.blue.dark,
  },
});

export default DataProfile;
