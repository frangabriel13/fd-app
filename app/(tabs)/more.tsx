import { View } from 'react-native';
import DataProfile from '@/components/more/DataProfile';
import Menu from '@/components/more/Menu';

const MoreScreen = () => (
  <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
    <DataProfile />
    <Menu />
  </View>
);

export default MoreScreen;
