import { StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fabricante Directo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // ESENCIAL: Ocupa todo el espacio disponible
    // backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
});


export default HomeScreen;