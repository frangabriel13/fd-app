import { Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

const Logo = () => {
  const handleLogoPress = () => {
    router.navigate('/(tabs)/');
  };

  return (
    <TouchableOpacity onPress={handleLogoPress}>
      <Text className='font-mont-bold text-2xl' style={{ color: Colors.orange.light }}>FD</Text>
    </TouchableOpacity>
  );
};


export default Logo;