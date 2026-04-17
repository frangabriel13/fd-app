import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchManufacturerStats,
  setSelectedPeriod,
  clearAdminStats,
} from '@/store/slices/adminStatsSlice';
import type { StatsPeriod } from '@/store/slices/adminStatsSlice';
import { Colors } from '@/constants/Colors';
import Images from '@/constants/Images';

const logoDefault = Images.defaultImages.logoDefault;

const PERIODS: { key: StatsPeriod; label: string; description: string }[] = [
  { key: 'week',  label: 'Semana', description: 'últimos 7 días'  },
  { key: 'month', label: 'Mes',    description: 'últimos 30 días' },
  { key: 'year',  label: 'Año',    description: 'últimos 365 días' },
];

export default function ManufacturerStatsScreen() {
  const dispatch = useAppDispatch();

  const { id, name, image } = useLocalSearchParams<{
    id: string;
    name: string;
    image: string;
  }>();

  const { stats, loadingStats, errorStats, selectedPeriod } = useAppSelector(
    (state) => state.adminStats
  );

  const [activePeriod, setActivePeriod] = useState<StatsPeriod>('month');

  const manufacturerId = Number(id);

  useEffect(() => {
    if (!isNaN(manufacturerId)) {
      dispatch(fetchManufacturerStats({ manufacturerId, period: activePeriod }));
    }
    return () => {
      dispatch(clearAdminStats());
    };
  }, [manufacturerId, dispatch]);

  const handlePeriodChange = (period: StatsPeriod) => {
    setActivePeriod(period);
    dispatch(setSelectedPeriod(period));
    if (!isNaN(manufacturerId)) {
      dispatch(fetchManufacturerStats({ manufacturerId, period }));
    }
  };

  const currentPeriodMeta = PERIODS.find((p) => p.key === activePeriod)!;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Card del fabricante */}
        <View style={styles.manufacturerCard}>
          <Image
            source={image ? { uri: image } : logoDefault}
            style={styles.manufacturerAvatar}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.manufacturerInfo}>
            <Text style={styles.manufacturerName} numberOfLines={2}>
              {name ?? 'Fabricante'}
            </Text>
            <Text style={styles.manufacturerSub}>Detalle de visitas al perfil</Text>
          </View>
        </View>

        {/* Selector de período */}
        <Text style={styles.sectionLabel}>PERÍODO</Text>
        <View style={styles.periodSelector}>
          {PERIODS.map((p) => (
            <Pressable
              key={p.key}
              onPress={() => handlePeriodChange(p.key)}
              style={[
                styles.periodButton,
                activePeriod === p.key && styles.periodButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  activePeriod === p.key && styles.periodButtonTextActive,
                ]}
              >
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Resultado de visitas */}
        <View style={styles.statsCard}>
          {loadingStats ? (
            <View style={styles.statsLoading}>
              <ActivityIndicator size="large" color={Colors.blue.dark} />
              <Text style={styles.statsLoadingText}>Cargando visitas...</Text>
            </View>
          ) : errorStats ? (
            <View style={styles.statsError}>
              <Ionicons name="alert-circle-outline" size={36} color="#ef4444" />
              <Text style={styles.statsErrorText}>{errorStats}</Text>
              <Pressable
                onPress={() =>
                  dispatch(fetchManufacturerStats({ manufacturerId, period: activePeriod }))
                }
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.statsContent}>
              {/* Ícono */}
              <View style={styles.statsIconWrapper}>
                <Ionicons name="eye" size={28} color={Colors.orange.dark} />
              </View>

              {/* Número grande */}
              <Text style={styles.statsNumber}>
                {stats?.views ?? 0}
              </Text>
              <Text style={styles.statsUnit}>visitas</Text>
              <Text style={styles.statsContext}>{currentPeriodMeta.description}</Text>

              {/* Divisor */}
              <View style={styles.statsDivider} />

              {/* Contexto adicional */}
              <View style={styles.statsFooter}>
                <Ionicons name="information-circle-outline" size={14} color={Colors.gray.semiDark} />
                <Text style={styles.statsFooterText}>
                  Cada usuario cuenta una sola visita por día
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },

  // — Scroll —
  scroll: {
    paddingBottom: 40,
  },

  // — Card del fabricante —
  manufacturerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  manufacturerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.gray.light,
    borderWidth: 2,
    borderColor: Colors.blue.dark,
    flexShrink: 0,
  },
  manufacturerInfo: {
    flex: 1,
    gap: 3,
  },
  manufacturerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
  },
  manufacturerSub: {
    fontSize: 12,
    color: Colors.gray.semiDark,
    fontWeight: '500',
  },

  // — Selector de período —
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray.default,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    gap: 1,
  },
  periodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  periodButtonActive: {
    backgroundColor: Colors.blue.dark,
  },
  periodButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray.semiDark,
  },
  periodButtonTextActive: {
    color: '#fff',
  },

  // — Card de estadísticas —
  statsCard: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },

  // — Loading —
  statsLoading: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 12,
  },
  statsLoadingText: {
    fontSize: 13,
    color: Colors.gray.semiDark,
  },

  // — Error —
  statsError: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  statsErrorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.blue.dark,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },

  // — Contenido de stats —
  statsContent: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 4,
  },
  statsIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff4ec',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statsNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.blue.dark,
    letterSpacing: -1,
    lineHeight: 64,
  },
  statsUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray.semiDark,
    marginTop: 2,
  },
  statsContext: {
    fontSize: 13,
    color: Colors.gray.default,
    marginTop: 2,
  },
  statsDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#f3f4f6',
    marginTop: 20,
    marginBottom: 16,
  },
  statsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsFooterText: {
    fontSize: 12,
    color: Colors.gray.semiDark,
    flex: 1,
    textAlign: 'center',
  },
});
