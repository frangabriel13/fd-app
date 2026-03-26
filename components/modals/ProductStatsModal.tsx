import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { productInstance } from '@/services/axiosConfig';

type Period = 'day' | 'week' | 'month' | 'all';

interface ProductStats {
  productId: number;
  period: string;
  views: number;
  cartEvents: number;
  purchases: number;
}

interface ProductStatsModalProps {
  visible: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

const PERIODS: { key: Period; label: string; short: string }[] = [
  { key: 'day', label: 'Últimas 24hs', short: '24h' },
  { key: 'week', label: 'Últimos 7 días', short: '7 días' },
  { key: 'month', label: 'Últimos 30 días', short: '30 días' },
  { key: 'all', label: 'Todo el historial', short: 'Total' },
];

const METRICS = [
  {
    key: 'views' as const,
    label: 'Vistas',
    icon: 'eye-outline' as const,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    gradFrom: '#60a5fa',
    gradTo: '#2563eb',
  },
  {
    key: 'cartEvents' as const,
    label: 'Al carrito',
    icon: 'cart-outline' as const,
    color: '#f97316',
    bgColor: '#fff7ed',
    gradFrom: '#fb923c',
    gradTo: '#ea580c',
  },
  {
    key: 'purchases' as const,
    label: 'Compras',
    icon: 'bag-check-outline' as const,
    color: '#10b981',
    bgColor: '#ecfdf5',
    gradFrom: '#34d399',
    gradTo: '#059669',
  },
];

// ─── Metric Card ────────────────────────────────────────────
const MetricCard = ({
  metric,
  value,
  fadeAnim,
}: {
  metric: (typeof METRICS)[number];
  value: number;
  fadeAnim: Animated.Value;
}) => (
  <Animated.View style={[styles.metricCard, { opacity: fadeAnim }]}>
    <View style={[styles.metricIconWrap, { backgroundColor: metric.bgColor }]}>
      <Ionicons name={metric.icon} size={18} color={metric.color} />
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{metric.label}</Text>
  </Animated.View>
);

// ─── Bar Chart ──────────────────────────────────────────────
const BarChart = ({ stats, fadeAnim }: { stats: ProductStats; fadeAnim: Animated.Value }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 88;
  const chartHeight = 160;
  const barWidth = 44;
  const totalBars = 3;
  const gap = (chartWidth - barWidth * totalBars) / (totalBars + 1);

  const data = METRICS.map((m) => ({
    ...m,
    value: stats[m.key],
  }));

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  // Y-axis grid lines (4 lines)
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    y: chartHeight - pct * (chartHeight - 24),
    label: Math.round(pct * maxValue),
  }));

  return (
    <Animated.View style={[styles.chartContainer, { opacity: fadeAnim }]}>
      <Text style={styles.chartTitle}>Resumen visual</Text>
      <View style={styles.chartInner}>
        <Svg width={chartWidth} height={chartHeight + 28}>
          <Defs>
            {data.map((item) => (
              <LinearGradient key={`grad-${item.key}`} id={`grad-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={item.gradFrom} stopOpacity="1" />
                <Stop offset="1" stopColor={item.gradTo} stopOpacity="1" />
              </LinearGradient>
            ))}
          </Defs>

          {/* Grid lines */}
          {gridLines.map((line, i) => (
            <React.Fragment key={`grid-${i}`}>
              <Line
                x1={28}
                y1={line.y}
                x2={chartWidth}
                y2={line.y}
                stroke="#f1f5f9"
                strokeWidth={1}
              />
              <SvgText
                x={22}
                y={line.y + 4}
                fontSize={9}
                fill="#94a3b8"
                textAnchor="end"
              >
                {line.label}
              </SvgText>
            </React.Fragment>
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const minBarHeight = 6;
            const rawHeight = (item.value / maxValue) * (chartHeight - 24);
            const barHeight = item.value > 0 ? Math.max(rawHeight, minBarHeight) : minBarHeight;
            const x = 34 + gap + index * (barWidth + gap);
            const y = chartHeight - barHeight;

            return (
              <React.Fragment key={item.key}>
                {/* Bar shadow */}
                <Rect
                  x={x + 2}
                  y={y + 2}
                  width={barWidth}
                  height={barHeight}
                  rx={8}
                  fill="rgba(0,0,0,0.04)"
                />
                {/* Bar */}
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={8}
                  fill={`url(#grad-${item.key})`}
                />
                {/* Value on top */}
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 6}
                  fontSize={12}
                  fontWeight="700"
                  fill="#1e293b"
                  textAnchor="middle"
                >
                  {item.value}
                </SvgText>
                {/* Label below */}
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 16}
                  fontSize={10}
                  fill="#64748b"
                  textAnchor="middle"
                >
                  {item.label}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </Animated.View>
  );
};

// ─── Conversion Funnel ──────────────────────────────────────
const ConversionRow = ({
  from,
  to,
  rate,
}: {
  from: string;
  to: string;
  rate: string;
}) => (
  <View style={styles.conversionRow}>
    <View style={styles.conversionLabelWrap}>
      <Text style={styles.conversionFrom}>{from}</Text>
      <Ionicons name="arrow-forward" size={12} color="#cbd5e1" style={{ marginHorizontal: 4 }} />
      <Text style={styles.conversionTo}>{to}</Text>
    </View>
    <View style={styles.conversionBadge}>
      <Text style={styles.conversionRate}>{rate}</Text>
    </View>
  </View>
);

// ─── Main Modal ─────────────────────────────────────────────
const ProductStatsModal = ({ visible, onClose, productId, productName }: ProductStatsModalProps) => {
  const [period, setPeriod] = useState<Period>('month');
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchStats = useCallback(async (selectedPeriod: Period) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productInstance.get(`/stats/product/${productId}?period=${selectedPeriod}`);
      setStats(response.data);
      setInitialLoad(false);
      // Fade in content
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    } catch {
      setError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  }, [productId, fadeAnim]);

  useEffect(() => {
    if (visible && productId) {
      fetchStats(period);
    }
  }, [visible, productId]);

  // When period changes (and modal already open with data), fetch new stats without resetting
  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;
    setPeriod(newPeriod);
    fetchStats(newPeriod);
  };

  useEffect(() => {
    if (!visible) {
      // Reset only when fully closed
      setStats(null);
      setError(null);
      setPeriod('month');
      setInitialLoad(true);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const getConversionRate = (numerator: number, denominator: number): string => {
    if (denominator === 0) return '0%';
    return `${((numerator / denominator) * 100).toFixed(1)}%`;
  };

  // ── Render states ───────────────────
  const renderLoading = () => (
    <View style={styles.centeredState}>
      <ActivityIndicator size="large" color="#021344" />
      <Text style={styles.stateText}>Cargando estadísticas...</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centeredState}>
      <View style={styles.errorIconWrap}>
        <Ionicons name="cloud-offline-outline" size={32} color="#ef4444" />
      </View>
      <Text style={styles.errorTitle}>Sin conexión</Text>
      <Text style={styles.stateText}>{error}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={() => fetchStats(period)} activeOpacity={0.7}>
        <Ionicons name="refresh-outline" size={16} color="#fff" />
        <Text style={styles.retryText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStats = () => {
    if (!stats) return null;

    return (
      <View style={styles.statsBody}>
        {/* Metric Cards */}
        <View style={styles.metricsRow}>
          {METRICS.map((metric) => (
            <MetricCard
              key={metric.key}
              metric={metric}
              value={stats[metric.key]}
              fadeAnim={fadeAnim}
            />
          ))}
        </View>

        {/* Bar Chart */}
        <BarChart stats={stats} fadeAnim={fadeAnim} />

        {/* Conversion funnel */}
        <Animated.View style={[styles.conversionCard, { opacity: fadeAnim }]}>
          <Text style={styles.conversionTitle}>Conversión</Text>
          <ConversionRow
            from="Vistas"
            to="Carrito"
            rate={getConversionRate(stats.cartEvents, stats.views)}
          />
          <View style={styles.conversionDivider} />
          <ConversionRow
            from="Carrito"
            to="Compra"
            rate={getConversionRate(stats.purchases, stats.cartEvents)}
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* ── Header ─────────────────────── */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconWrap}>
                <Ionicons name="analytics" size={18} color="#fff" />
              </View>
              <View style={styles.headerTextWrap}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {productName}
                </Text>
                <Text style={styles.headerSubtitle}>Estadísticas del producto</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* ── Period Selector ─────────────── */}
          <View style={styles.periodBar}>
            {PERIODS.map((p) => {
              const isActive = period === p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  onPress={() => handlePeriodChange(p.key)}
                  style={[styles.periodTab, isActive && styles.periodTabActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.periodText, isActive && styles.periodTextActive]}>
                    {p.short}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Content ────────────────────── */}
          <View style={styles.content}>
            {/* Inline loading overlay — keeps previous data visible */}
            {loading && !initialLoad && (
              <View style={styles.inlineLoading}>
                <ActivityIndicator size="small" color="#021344" />
              </View>
            )}

            {initialLoad && loading
              ? renderLoading()
              : error
                ? renderError()
                : renderStats()}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 19, 68, 0.45)',
  },
  modalContainer: {
    width: '92%',
    maxWidth: 420,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '88%',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#021344',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Period
  periodBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 6,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  periodTabActive: {
    backgroundColor: '#021344',
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  periodTextActive: {
    color: '#fff',
  },

  // Content
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    position: 'relative',
  },
  inlineLoading: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(248, 250, 252, 0.85)',
    borderRadius: 20,
    padding: 6,
  },

  // States
  centeredState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  stateText: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 10,
    textAlign: 'center',
  },
  errorIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#021344',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 16,
  },
  retryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  // Stats body
  statsBody: {
    gap: 12,
  },

  // Metric cards
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94a3b8',
    marginTop: 2,
  },

  // Chart
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  chartInner: {
    alignItems: 'center',
  },

  // Conversion
  conversionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  conversionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conversionLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversionFrom: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  conversionTo: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  conversionBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  conversionRate: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  conversionDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
});

export default ProductStatsModal;
