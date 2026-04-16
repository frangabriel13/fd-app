import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import StatsRankingTable from '@/components/tables/StatsRankingTable';

export default function EstadisticasScreen() {
  return (
    <View style={styles.container}>
      <StatsRankingTable />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
});
