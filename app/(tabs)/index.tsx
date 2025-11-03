import Slider from '@/components/slider/Slider';
import Genders from '@/components/home/Genders';
import { StyleSheet, ScrollView, View } from 'react-native';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Slider />
      <View style={styles.homeContent}>  
        <Genders />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
});


export default HomeScreen;