import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, View } from 'react-native';
import { BodyText, Card, H3 } from '../ui';

const DataProfile = () => {
  return (
    // <Card variant="default" className='bg-secondary-400'>
    <Card variant="default" className='bg-secondary-400'>
      <H3 className='text-white'>Franco Mansilla</H3>
      <View style={styles.text}>
        <BodyText className='text-white'>Mi perfil</BodyText>
        <AntDesign name="right" size={12} color="white" style={{ marginLeft: 2 }} />
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