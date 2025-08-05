import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { StyleSheet, View } from 'react-native';
import { BodyText } from '../ui';

interface MenuItemProps {
  icon: string;
  label: string;
  IconComponent?: any; // Puede ser AntDesign, Ionicons, MaterialIcons, etc.
  iconSize?: number;
  iconStyle?: object;
}

const MenuItem = ({ 
  icon, 
  label, 
  IconComponent = AntDesign, 
  iconSize = 20,
  iconStyle = {}
}: MenuItemProps) => (
  <View style={styles.item}>
    <View style={styles.iconContainer}>
      <IconComponent 
        name={icon} 
        size={iconSize} 
        color="#333" 
        style={[styles.defaultIcon, iconStyle]} 
      />
    </View>
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
        <MenuItem icon="package" label="Packs/Combos" IconComponent={Octicons} />
        <MenuItem 
          icon="wifi" 
          label="Live Shopping" 
          IconComponent={FontAwesome6}
          iconSize={18}
          iconStyle={{ transform: [{ rotate: '45deg' }] }}
        />
        <MenuItem icon="user" label="Mi perfil" />
      </View>

      {/* Primera línea divisoria */}
      <View style={styles.divider} />

      {/* Segunda lista */}
      <View>
        <MenuItem icon="hearto" label="Favoritos" IconComponent={AntDesign} />
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
  iconContainer: {
    width: 32, // Ancho fijo para mantener alineación
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultIcon: {
    // Estilos base para todos los íconos
  },
  divider: {
    height: 1,
    backgroundColor: '#d1d5db',
    width: '100%',
    marginVertical: 16,
  },
});


export default Menu;