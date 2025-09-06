import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const RoleCard = ({
  role,
  title,
  image,
  onPress,
  isSelected,
}: {
  role: 'mayorista' | 'fabricante';
  title: string;
  image: any;
  onPress: () => void;
  isSelected: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        isSelected && styles.selectedCard,
      ]}
    >
      <Image 
        source={image} 
        style={styles.image}
        resizeMode="contain" // Ajusta la imagen sin distorsión
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 5,
    borderColor: '#ccc', // Borde gris por defecto
    borderRadius: 8,
    // padding: 16,
    // marginBottom: 16,
    // alignItems: 'center',
    backgroundColor: '#ccc',
  },
  selectedCard: {
    backgroundColor: 'orange',
    borderColor: 'orange', // Borde naranja si está seleccionado
  },
  image: {
    width: '100%', // Ocupa todo el ancho del contenedor
    height: undefined, // Permite que el alto se ajuste automáticamente
    aspectRatio: 1200 / 800, // Relación de aspecto de la imagen
    borderRadius: 8,
  },
});


export default RoleCard;