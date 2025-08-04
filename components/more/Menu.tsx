import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, View } from 'react-native';
import { BodyText } from '../ui';

const MenuItem = ({ icon, label }: { icon: any; label: string }) => (
  <View style={styles.item}>
    <AntDesign name={icon} size={20} color="#333" style={{ marginRight: 12 }} />
    <BodyText>{label}</BodyText>
  </View>
);

const Menu = () => {
  return (
    <View style={styles.container} className='p-4'>
      {/* Primera lista */}
      <View>
        <MenuItem icon="home" label="Inicio" />
        <MenuItem icon="shoppingcart" label="Tienda" />
        <MenuItem icon="user" label="Mi perfil" />
      </View>

      {/* Primera línea divisoria */}
      <View style={styles.divider} />

      {/* Segunda lista */}
      <View>
        <MenuItem icon="heart" label="Favoritos" />
        <MenuItem icon="staro" label="Tiendas seguidas" />
        <MenuItem icon="shoppingcart" label="Mis compras" />
      </View>

      {/* Segunda línea divisoria */}
      <View style={styles.divider} />

      {/* Tercera lista */}
      <View>
        <MenuItem icon="man" label="Hombre" />
        <MenuItem icon="woman" label="Mujer" />
        <MenuItem icon="smileo" label="Niños" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'blue',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#d1d5db',
    width: '100%',
    marginVertical: 16,
  },
});


export default Menu;