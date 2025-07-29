import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from './Logo';
import Notification from './Notification';
import Search from './Search';

const Header = () => {
  // Los insets son las áreas seguras del dispositivo donde no se superpone el contenido con la barra de estado o los bordes del dispositivo.
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]} className='bg-primary'>
      <Logo />
      <Search />
      <Notification />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});


export default Header;