import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, View, Pressable } from 'react-native';
import { BodyText, Card, H3 } from '../ui';
import { useRouter } from 'expo-router';

const DataProfile = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/(dashboard)/perfil');
  }

  return (
    <Pressable onPress={handlePress}>
      <Card variant="default" className='bg-secondary-400'>
        <H3 className='text-white'>Franco Mansilla</H3>
        <View style={styles.text}>
          <BodyText className='text-white'>Mi perfil</BodyText>
          <AntDesign name="right" size={12} color="white" style={{ marginLeft: 2 }} />
        </View>
      </Card>
    </Pressable>
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