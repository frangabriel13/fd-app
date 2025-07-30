import { Text, TouchableOpacity } from 'react-native';

const Logo = () => {
  const handleLogoPress = () => {
    // Aquí puedes agregar la lógica de navegación o acción que quieras
    console.log('Logo presionado');
  };

  return (
    <TouchableOpacity onPress={handleLogoPress}>
      <Text className='font-mont-bold text-secondary text-2xl'>FD</Text>
    </TouchableOpacity>
  );
};


export default Logo;