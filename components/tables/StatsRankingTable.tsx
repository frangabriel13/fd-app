import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchManufacturersRanking } from '@/store/slices/adminStatsSlice';
import { Colors } from '@/constants/Colors';
import Images from '@/constants/Images';

const logoDefault = Images.defaultImages.logoDefault;

// — Helpers —
const getRankStyle = (rank: number): { bg: string; text: string } => {
  if (rank === 1) return { bg: '#f59e0b', text: '#fff' };
  if (rank === 2) return { bg: '#9ca3af', text: '#fff' };
  if (rank === 3) return { bg: '#b45309', text: '#fff' };
  return { bg: '#e5e7eb', text: '#6b7280' };
};

const formatViews = (views: number): string => {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
  return views.toString();
};

// — Fila del ranking —
interface RankingItem {
  manufacturerId: number;
  name: string;
  image: string | null;
  views: number;
}

interface RankingRowProps {
  item: RankingItem;
  rank: number;
  maxViews: number;
}

const RankingRow = React.memo(function RankingRow({ item, rank, maxViews }: RankingRowProps) {
  const rankStyle = getRankStyle(rank);
  const barWidth = maxViews > 0 ? (item.views / maxViews) * 100 : 0;

  const handleView = () => {
    router.push({
      pathname: '/(dashboard)/estadisticas/[id]',
      params: {
        id: item.manufacturerId.toString(),
        name: item.name,
        image: item.image ?? '',
      },
    });
  };

  return (
    <View style={styles.row}>
      {/* Rango */}
      <View style={[styles.rankBadge, { backgroundColor: rankStyle.bg }]}>
        <Text style={[styles.rankText, { color: rankStyle.text }]}>{rank}</Text>
      </View>

      {/* Avatar */}
      <Image
        source={item.image ? { uri: item.image } : logoDefault}
        style={styles.avatar}
        contentFit="cover"
        transition={200}
      />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        {/* Barra de progreso relativa */}
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${barWidth}%` as any }]} />
        </View>
      </View>

      {/* Vistas */}
      <View style={styles.viewsContainer}>
        <Ionicons name="eye-outline" size={13} color={Colors.gray.semiDark} />
        <Text style={styles.viewsText}>{formatViews(item.views)}</Text>
      </View>

      {/* Botón Ver */}
      <Pressable
        onPress={handleView}
        android_ripple={{ color: '#e8edf5' }}
        style={({ pressed }) => [styles.verButton, pressed && styles.verButtonPressed]}
      >
        <View style={styles.verButtonInner}>
          <Text style={styles.verButtonText}>Ver</Text>
          <Ionicons name="chevron-forward" size={12} color={Colors.blue.dark} />
        </View>
      </Pressable>
    </View>
  );
});

// — Header de la tabla —
const TableHeader = () => (
  <View style={styles.tableHeader}>
    <Text style={styles.headerRank}>#</Text>
    <View style={styles.headerSpacer} />
    <Text style={styles.headerName}>Fabricante</Text>
    <View style={{ flex: 1 }} />
    <View style={styles.headerViewsGroup}>
      <Text style={styles.headerViews}>Visitas</Text>
    </View>
  </View>
);

// — Componente principal —
const StatsRankingTable = () => {
  const dispatch = useAppDispatch();
  const { ranking, loadingRanking, errorRanking } = useAppSelector(
    (state) => state.adminStats
  );

  useEffect(() => {
    dispatch(fetchManufacturersRanking());
  }, [dispatch]);

  const maxViews = ranking.length > 0 ? ranking[0].views : 1;
  const totalViews = ranking.reduce((sum, m) => sum + m.views, 0);

  return (
    <View style={styles.container}>
      {/* Resumen */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIconBox, { backgroundColor: '#e8edf5' }]}>
            <Ionicons name="people-outline" size={16} color={Colors.blue.dark} />
          </View>
          <Text style={styles.summaryValue}>{ranking.length}</Text>
          <Text style={styles.summaryLabel}>Fabricantes</Text>
        </View>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIconBox, { backgroundColor: '#fff4ec' }]}>
            <Ionicons name="eye-outline" size={16} color={Colors.orange.dark} />
          </View>
          <Text style={styles.summaryValue}>{formatViews(totalViews)}</Text>
          <Text style={styles.summaryLabel}>Visitas totales</Text>
        </View>
        {ranking.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBox, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="trophy-outline" size={16} color="#d97706" />
            </View>
            <Text style={[styles.summaryValue, styles.summaryTopName]} numberOfLines={1}>
              {ranking[0].name}
            </Text>
            <Text style={styles.summaryLabel}>Más visitado</Text>
          </View>
        )}
      </View>

      {/* Tabla */}
      <View style={styles.tableWrapper}>
        <TableHeader />

        {loadingRanking ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={Colors.blue.dark} />
            <Text style={styles.centerStateText}>Cargando ranking...</Text>
          </View>
        ) : errorRanking ? (
          <View style={styles.centerState}>
            <Ionicons name="alert-circle-outline" size={40} color="#ef4444" />
            <Text style={styles.errorText}>{errorRanking}</Text>
            <Pressable
              onPress={() => dispatch(fetchManufacturersRanking())}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : ranking.length === 0 ? (
          <View style={styles.centerState}>
            <Ionicons name="bar-chart-outline" size={40} color={Colors.gray.default} />
            <Text style={styles.centerStateText}>Sin datos de visitas todavía</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {ranking.map((item, index) => (
              <React.Fragment key={item.manufacturerId}>
                <RankingRow item={item} rank={index + 1} maxViews={maxViews} />
                {index < ranking.length - 1 && <View style={styles.separator} />}
              </React.Fragment>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // — Resumen —
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.gray.light,
    paddingVertical: 6,
    paddingHorizontal: 6,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 6,
    gap: 3,
  },
  summaryIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    height: 24,
    textAlignVertical: 'center',
  },
  summaryTopName: {
    fontSize: 12,
  },
  summaryLabel: {
    fontSize: 10,
    color: Colors.gray.semiDark,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // — Tabla —
  tableWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: Colors.gray.light,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerRank: {
    width: 28,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray.semiDark,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
    marginHorizontal: 10,
  },
  headerName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray.semiDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerViewsGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 114,
  },
  headerViews: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray.semiDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // — Fila —
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 10,
    backgroundColor: '#fff',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray.light,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  barTrack: {
    height: 3,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 3,
    backgroundColor: Colors.orange.dark,
    borderRadius: 2,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 52,
    justifyContent: 'flex-end',
  },
  viewsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },

  // — Botón Ver —
  verButton: {
    backgroundColor: '#e8edf5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexShrink: 0,
  },
  verButtonPressed: {
    backgroundColor: '#d1ddf5',
  },
  verButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  verButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.blue.dark,
  },

  // — Separador —
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 52,
  },

  // — Estados —
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  centerStateText: {
    fontSize: 14,
    color: Colors.gray.semiDark,
    textAlign: 'center',
  },
  errorText: {
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
});

export default StatsRankingTable;
