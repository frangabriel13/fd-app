import { View, Modal, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { Typography, Button } from '@/components/ui';
import { spacing, borderRadius } from '@/constants/Styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
}

const SubscriptionModal = ({ visible, onClose }: SubscriptionModalProps) => {
  const handleClose = () => {
    onClose();
  };

  const handleContactAdmin = () => {
    const phoneNumber = '5491234567890'; // Reemplaza con el número del admin
    const message = encodeURIComponent('Hola, me gustaría actualizar mi plan a Premium para acceder a todas las funciones.');
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No se pudo abrir WhatsApp');
        }
      })
      .catch(() => Alert.alert('Error', 'No se pudo abrir WhatsApp'));
  };

  const premiumFeatures = [
    {
      icon: '🎥',
      title: 'Videos de productos',
      description: 'Muestra tus productos en acción con videos de hasta 30 segundos'
    },
    {
      icon: '📊',
      title: 'Estadísticas avanzadas',
      description: 'Accede a métricas detalladas de tus publicaciones y ventas'
    },
    {
      icon: '⭐',
      title: 'Prioridad en búsquedas',
      description: 'Tus productos aparecen primero en los resultados'
    },
    {
      icon: '🚀',
      title: 'Publicaciones ilimitadas',
      description: 'Publica todos los productos que quieras sin restricciones'
    },
    {
      icon: '💬',
      title: 'Soporte prioritario',
      description: 'Respuestas rápidas y atención personalizada'
    }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.premiumIcon}>
              <Typography variant="h1" className="text-center">
                ⭐
              </Typography>
            </View>
            <Typography variant="h2" className="text-gray-800 text-center mb-3 font-bold">
              Actualiza a Premium
            </Typography>
            <Typography variant="body" className="text-gray-600 text-center mb-2">
              Desbloquea funciones exclusivas para hacer crecer tu negocio
            </Typography>
          </View>

          {/* Premium Badge */}
          {/* <View style={styles.premiumBanner}>
            <View style={styles.bannerContent}>
              <Typography variant="h3" className="text-white font-bold mb-1">
                🎥 Videos de Productos
              </Typography>
              <Typography variant="caption" className="text-orange-100">
                Esta función está disponible solo para suscriptores Premium
              </Typography>
            </View>
          </View> */}

          {/* Features */}
          <View style={styles.featuresSection}>
            {/* <Typography variant="h3" className="text-gray-800 mb-4 font-bold">
              ¿Qué incluye Premium?
            </Typography>
             */}
            <View style={styles.featuresList}>
              {premiumFeatures.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Typography variant="h2" className="text-center">
                      {feature.icon}
                    </Typography>
                  </View>
                  <View style={styles.featureContent}>
                    <Typography variant="body" className="text-gray-800 font-semibold mb-1">
                      {feature.title}
                    </Typography>
                    <Typography variant="caption" className="text-gray-600">
                      {feature.description}
                    </Typography>
                  </View>
                  <View style={styles.checkIcon}>
                    <MaterialIcons name="check-circle" size={24} color="#10B981" />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <View style={styles.priceCard}>
              <Typography variant="caption" className="text-gray-600 text-center mb-2">
                Mejora tu plan ahora
              </Typography>
              <Typography variant="h1" className="text-orange-600 text-center font-bold mb-1">
                Premium
              </Typography>
              <Typography variant="caption" className="text-gray-500 text-center">
                Contacta con nosotros para conocer los precios
              </Typography>
            </View>

            <Button
              variant="primary"
              onPress={handleContactAdmin}
              style={styles.contactButton}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="whatsapp" size={20} color="#fff" />
                <Typography variant="body" className="text-white font-semibold ml-2">
                  Contactar por WhatsApp
                </Typography>
              </View>
            </Button>

            <TouchableOpacity onPress={handleClose} style={styles.laterButton}>
              <Typography variant="body" className="text-gray-600 text-center">
                Tal vez más tarde
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  premiumIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 3,
    borderColor: '#FED7AA',
  },
  premiumBanner: {
    backgroundColor: '#F97316',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerContent: {
    alignItems: 'center',
  },
  featuresSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  checkIcon: {
    marginLeft: spacing.sm,
  },
  ctaSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  priceCard: {
    backgroundColor: '#FFF7ED',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: '#FED7AA',
  },
  contactButton: {
    minHeight: 56,
    marginBottom: spacing.md,
    backgroundColor: '#25D366',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  laterButton: {
    paddingVertical: spacing.md,
  },
});


export default SubscriptionModal;