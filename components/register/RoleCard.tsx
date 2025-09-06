import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const RoleCard = ({
  role,
  title,
  image,
  onPress,
}: {
  role: 'mayorista' | 'fabricante';
  title: string;
  image: any;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      // className="border p-4 rounded-lg"
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
  image: {
    width: '100%', // Ocupa todo el ancho del contenedor
    height: undefined, // Permite que el alto se ajuste automáticamente
    aspectRatio: 1200 / 800, // Relación de aspecto de la imagen
    borderRadius: 8,
  },
});


export default RoleCard;