import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const HeaderProfile = () => {
  const { selectedManufacturer } = useSelector((state: RootState) => state.manufacturer);
  
  console.log('📱 HeaderProfile obtuvo manufacturer desde Redux:', selectedManufacturer);
  
  return (
    <View style={styles.container}>
      <Text>HeaderProfile</Text>
      {selectedManufacturer && (
        <Text>Fabricante: {selectedManufacturer.name}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});


export default HeaderProfile;