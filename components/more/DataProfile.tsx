import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, Text, View } from 'react-native';

const DataProfile = () => {
  return (
    <View style={styles.container} className='bg-secondary p-3'>
      <Text className='font-mont-medium'>Franco Mansilla</Text>
      <Text>Mi perfil <AntDesign name="right" size={24} color="black" /></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 10,
  },
});


export default DataProfile;