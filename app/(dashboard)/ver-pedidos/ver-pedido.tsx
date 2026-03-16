import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui';

const VerPedidoScreen = () => {
  return (
    <View style={styles.container}>
      <Typography variant="h2" className="text-gray-800">
        Ver Pedido
      </Typography>
      <Typography variant="body" className="text-gray-600 mt-4">
        Esta pantalla está en construcción
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
});

export default VerPedidoScreen;
