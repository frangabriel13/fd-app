import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { contactarSoporte } from '@/utils/whatsapp';

const FAQ_ITEMS = [
  {
    id: '1',
    question: '¿Hacen envíos?',
    answer: '¡Sí! Hacemos envíos a todo el país. El costo del envío está a cargo del cliente y trabajamos con varias empresas de envío.',
  },
  {
    id: '2',
    question: '¿Cuáles son los medios de pago?',
    answer: 'Puedes pagar por transferencia o depósito bancario, o en efectivo en el local. Una vez acreditado el pago, despachamos o entregamos el pedido, ¡y no antes!',
  },
  {
    id: '3',
    question: '¿Cuánto cuesta el envío?',
    answer: 'El costo depende de la empresa de envío que elijas y del peso del paquete, por lo tanto, no podemos decirte el costo exacto. 📦',
  },
  {
    id: '4',
    question: '¿Debo pagar el costo del envío por adelantado?',
    answer: 'Por lo general, se paga cuando el cliente recibe el paquete. 📦',
  },
  {
    id: '5',
    question: '¿Cuál es la compra mínima?',
    answer: 'La compra mínima dependerá de cada fabricante. Lee la franja naranja en la parte superior de la pantalla de cada fabricante para más información.',
  },
  {
    id: '6',
    question: '¿Puedo pasar por el local a comprar?',
    answer: 'Sí, puedes pasar y elegir los modelos y tallas que necesites. Sin embargo, recomendamos realizar la compra desde la app para asegurarte el stock de la mercadería.',
  },
];

// — Ítem de FAQ con acordeón animado —
const FaqItem = ({ question, answer, isLast }: { question: string; answer: string; isLast: boolean }) => {
  const [open, setOpen] = useState(false);
  const measuredHeight = useRef(0);
  const heightAnim   = useSharedValue(0);
  const rotateAnim   = useSharedValue(0);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    heightAnim.value = withTiming(next ? measuredHeight.current : 0, { duration: 250 });
    rotateAnim.value = withTiming(next ? 1 : 0, { duration: 250 });
  };

  const animatedContainer = useAnimatedStyle(() => ({
    height: heightAnim.value,
    overflow: 'hidden',
  }));

  const animatedChevron = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value * 180}deg` }],
  }));

  return (
    <View>
      <Pressable
        onPress={toggle}
        android_ripple={{ color: '#f3f4f6' }}
        style={({ pressed }) => pressed && styles.itemPressed}
      >
        <View style={styles.faqRow}>
          <Text style={styles.questionText}>{question}</Text>
          <Animated.View style={animatedChevron}>
            <Ionicons name="chevron-down" size={16} color={Colors.gray.semiDark} />
          </Animated.View>
        </View>
      </Pressable>

      {/* Vista oculta para medir la altura real del contenido */}
      <View
        pointerEvents="none"
        onLayout={(e) => { measuredHeight.current = e.nativeEvent.layout.height; }}
        style={styles.measureHidden}
      >
        <View style={styles.answerBox}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      </View>

      {/* Contenedor animado */}
      <Animated.View style={animatedContainer}>
        <View style={styles.answerBox}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      </Animated.View>

      {!isLast && <View style={styles.separator} />}
    </View>
  );
};

// — Pantalla principal —
const AyudaScreen = () => {
  const handleWhatsApp = () => contactarSoporte();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="help-circle" size={36} color={Colors.blue.dark} />
        </View>
        <Text style={styles.heroTitle}>¿En qué podemos ayudarte?</Text>
        <Text style={styles.heroSubtitle}>
          Encontrá respuestas a las preguntas más frecuentes sobre compras, envíos y pagos.
        </Text>
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
        <View style={styles.card}>
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isLast={index === FAQ_ITEMS.length - 1}
            />
          ))}
        </View>
      </View>

      {/* CTA WhatsApp */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Necesitás más información?</Text>
        <View style={styles.card}>
          <View style={styles.ctaContent}>
            <View style={styles.ctaTextBlock}>
              <Text style={styles.ctaTitle}>¡Contactanos en Fabricante Directo!</Text>
              <Text style={styles.ctaSubtitle}>
                Respondemos por WhatsApp en horario comercial.
              </Text>
            </View>
            <Pressable
              onPress={handleWhatsApp}
              android_ripple={{ color: '#dcfce7' }}
              style={({ pressed }) => pressed && styles.whatsappPressed}
            >
              <View style={styles.whatsappButton}>
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                <Text style={styles.whatsappText}>Abrir WhatsApp</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
  content: {
    paddingBottom: 80,
  },

  // — Hero —
  hero: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 8,
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#e8edf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13,
    color: Colors.gray.semiDark,
    textAlign: 'center',
    lineHeight: 19,
  },

  // — Secciones —
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },

  // — FAQ —
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  answerBox: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  answerText: {
    fontSize: 13,
    color: Colors.gray.semiDark,
    lineHeight: 20,
  },
  measureHidden: {
    position: 'absolute',
    opacity: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 14,
  },
  itemPressed: {
    backgroundColor: '#f9fafb',
  },

  // — CTA WhatsApp —
  ctaContent: {
    padding: 16,
    gap: 14,
  },
  ctaTextBlock: {
    gap: 4,
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  ctaSubtitle: {
    fontSize: 13,
    color: Colors.gray.semiDark,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
  },
  whatsappPressed: {
    backgroundColor: '#15803d',
  },
  whatsappText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

export default AyudaScreen;
