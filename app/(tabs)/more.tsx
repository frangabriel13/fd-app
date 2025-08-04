import DataProfile from '@/components/more/DataProfile';
import Menu from '@/components/more/Menu';
import { View } from 'react-native';

const ManusScreen = () => {
  return (
    <View className='flex-1'>
      <DataProfile />
      <Menu />
    </View>
  );
}


export default ManusScreen;