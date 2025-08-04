import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import { BodyText } from '../ui';

interface MenuItemProps {
  icon: string;
  label: string;
  IconComponent?: any; // Puede ser AntDesign, Ionicons, MaterialIcons, etc.
}

const MenuItem = ({ icon, label, IconComponent = AntDesign }: MenuItemProps) => (
  <View style={styles.item}>
    <IconComponent name={icon} size={20} color="#333" style={{ marginRight: 12 }} />
    <BodyText>{label}</BodyText>
  </View>
);

const Menu = () => {
  return (
    <View style={styles.container} className='p-4'>
      {/* Primera lista */}
      <View>
        <MenuItem icon="home" label="Inicio" />
        <MenuItem icon="storefront-outline" label="Tienda" IconComponent={Ionicons} />
        <MenuItem icon="user" label="Mi perfil" />
      </View>

      {/* Primera línea divisoria */}
      <View style={styles.divider} />

      {/* Segunda lista */}
      <View>
        <MenuItem icon="heart" label="Favoritos" />
        <MenuItem icon="star-outline" label="Tiendas seguidas" IconComponent={Ionicons} />
        <MenuItem icon="shopping-bag" label="Mis compras" IconComponent={MaterialIcons} />
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
    marginBottom: 4,
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#d1d5db',
    width: '100%',
    marginVertical: 16,
  },
});


export default Menu;