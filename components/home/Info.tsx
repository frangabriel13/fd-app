import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Info = () => {
  const features = [
    {
      icon: 'rocket-outline' as const,
      title: 'Envíos',
      subtitle: 'A todo el país',
    },
    {
      icon: 'card-outline' as const,
      title: 'Pagos',
      subtitle: 'Varios métodos',
    },
    {
      icon: 'headset-outline' as const,
      title: 'Soporte',
      subtitle: 'Personalizado',
    },
  ];

  return (
    <View style={styles.container}>
      {features.map((feature, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.iconContainer}>
            <Ionicons name={feature.icon} size={18} color="#021344" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{feature.title}</Text>
            <Text style={styles.subtitle}>{feature.subtitle}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 4,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#eff6ff',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexShrink: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#021344',
  },
  subtitle: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 1,
  },
});

export default Info;
