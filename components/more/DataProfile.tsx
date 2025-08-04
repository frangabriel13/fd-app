import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, View } from 'react-native';
import { BodyText, Card, H3 } from '../ui';

const DataProfile = () => {
  return (
    <Card variant="default" className='bg-secondary'>
      <H3 className='text-white'>Franco Mansilla</H3>
      <View style={styles.text}>
        <BodyText className='text-white'>Mi perfil</BodyText>
        <AntDesign name="right" size={18} color="white" style={{ marginLeft: 8 }} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  text: {
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },
});


export default DataProfile;