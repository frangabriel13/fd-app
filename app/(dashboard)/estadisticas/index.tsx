import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import StatsRankingTable from '@/components/tables/StatsRankingTable';

export default function EstadisticasScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <Text style={styles.headerSubtitle}>Ranking de fabricantes por visitas</Text>
      </View>

      {/* Tabla de ranking */}
      <StatsRankingTable />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
  header: {
    backgroundColor: Colors.blue.dark,
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
});
