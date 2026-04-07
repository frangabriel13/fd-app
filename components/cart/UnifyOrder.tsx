import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { shadows } from '@/constants/Styles';
import { formatPrice } from '@/utils/formatPrice';

interface UnifyOrderProps {
  totalAmount: number;
  totalItems: number;
  manufacturersCount: number;
  onClearCart?: () => void;
  onUnifyOrder?: () => void;
}

const UnifyOrder: React.FC<UnifyOrderProps> = ({
  totalAmount,
  totalItems,
  manufacturersCount,
  onClearCart,
  onUnifyOrder,
}) => (
  <View style={styles.container}>
    {/* ── Resumen ─────────────────────────── */}
    <View style={styles.summaryRow}>
      <View style={styles.summaryLeft}>
        <Text style={styles.summaryLabel}>Total general</Text>
        <Text style={styles.summaryMeta}>
          {totalItems} {totalItems === 1 ? 'unidad' : 'unidades'} ·{' '}
          {manufacturersCount} {manufacturersCount === 1 ? 'fabricante' : 'fabricantes'}
        </Text>
      </View>
      <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
    </View>

    {/* ── CTA principal ───────────────────── */}
    <Pressable
      onPress={onUnifyOrder}
      android_ripple={{ color: '#d95f10' }}
      style={styles.unifyBtn}
    >
      <View style={styles.unifyBtnInner}>
        <Ionicons name="bag-check-outline" size={19} color="#fff" />
        <Text style={styles.unifyBtnText}>Unificar todos los pedidos</Text>
      </View>
    </Pressable>

    {/* ── Vaciar carrito ──────────────────── */}
    <Pressable onPress={onClearCart} style={({ pressed }) => [styles.clearBtn, pressed && styles.clearBtnPressed]}>
      <Text style={styles.clearBtnText}>Vaciar carrito</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    ...shadows.lg,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryLeft: {
    gap: 3,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray.semiDark,
  },
  summaryMeta: {
    fontSize: 12,
    color: Colors.gray.default,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.blue.dark,
  },

  unifyBtn: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  unifyBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.orange.dark,
    paddingVertical: 14,
    borderRadius: 6,
  },
  unifyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },

  clearBtn: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  clearBtnPressed: {
    opacity: 0.5,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.general.error,
    textAlign: 'center',
  },
});

export default UnifyOrder;
