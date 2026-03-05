import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Info = () => {
  const features = [
    {
      icon: 'rocket-outline',
      title: 'Envíos',
      description: 'Envíos a todo el país.',
    },
    {
      icon: 'card-outline',
      title: 'Pagos',
      description: 'Varios métodos de pago.',
    },
    {
      icon: 'headset-outline',
      title: 'Soporte',
      description: 'Atención personalizada.',
    },
  ];

  return (
    <View style={styles.container}>
      {features.map((feature, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name={feature.icon as any} size={28} color="#021344" />
          </View>
          <Text style={styles.title}>{feature.title}</Text>
          <Text style={styles.description}>{feature.description}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#e0f2fe',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});


export default Info;