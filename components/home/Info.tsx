import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FEATURES = [
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

const Info = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topBorder} />
      <View style={styles.row}>
        {FEATURES.map((feature, index) => (
          <React.Fragment key={index}>
            {index > 0 && <View style={styles.divider} />}
            <View style={styles.item}>
              <View style={styles.iconContainer}>
                <Ionicons name={feature.icon} size={24} color="#021344" />
              </View>
              <Text style={styles.title}>{feature.title}</Text>
              <Text style={styles.subtitle}>{feature.subtitle}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
      <View style={styles.bottomBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  topBorder: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  bottomBorder: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  divider: {
    width: 1,
    backgroundColor: '#f3f4f6',
    alignSelf: 'stretch',
    marginVertical: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f4ff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#021344',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default Info;
