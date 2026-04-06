import DataProfile from '@/components/more/DataProfile';
import Menu from '@/components/more/Menu';
import { View } from 'react-native';

const MoreScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <DataProfile />
      <Menu />
    </View>
  );
}


export default MoreScreen;