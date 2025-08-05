import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
  iconSize = 24,
  iconStyle = {}
}: MenuItemProps) => (
  <Pressable
    style={({ pressed }) => [
        styles.item,
        pressed && styles.pressedItem
      ]}
      android_ripple={{ color: '#e5e7eb' }}
      // Puedes agregar onPress aquí si lo necesitas
    >
    <View style={styles.item}>
      <View style={styles.iconContainer}>
        <IconComponent 
          name={icon} 
          size={iconSize} 
          color="#333" 
          style={[styles.defaultIcon, iconStyle]} 
        />
      </View>
      <BodyText style={{ color: 'black' }}>{label}</BodyText>
    </View>
  </Pressable>
);

const Menu = () => {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
    >
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
        <MenuItem icon="notifications-outline" label="Notificaciones" IconComponent={Ionicons} />
        <MenuItem icon="hearto" label="Favoritos" IconComponent={AntDesign} />
        <MenuItem icon="store-plus-outline" label="Tiendas seguidas" IconComponent={MaterialCommunityIcons} />
        <MenuItem icon="bag-check-outline" label="Mis compras" IconComponent={Ionicons} />
        <MenuItem icon="headphones-simple" label="Ayuda" IconComponent={FontAwesome6} />
      </View>

      {/* Segunda línea divisoria */}
      <View style={styles.divider} />

      {/* Tercera lista */}
      <View>
        <MenuItem icon="staro" label="Productos destacados" />
        <MenuItem icon="burst-new" label="Nuevos ingresos" IconComponent={Foundation} />
        <MenuItem icon="tago" label="Ofertas" />
        <MenuItem icon="bed-outline" label="Blanquería" IconComponent={Ionicons} />
        <MenuItem icon="woman-outline" label="Lencería" IconComponent={Ionicons} />
        <MenuItem icon="shoe-sneaker" label="Calzado" IconComponent={MaterialCommunityIcons} />
        <MenuItem icon="diamond" label="Bisutería" IconComponent={FontAwesome} />
        <MenuItem icon="layers-outline" label="Telas textiles" IconComponent={Ionicons} />
        <MenuItem icon="scissors" label="Insumos para costura y confección" IconComponent={FontAwesome} />
        <MenuItem icon="tool" label="Máquinas textiles" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 4,
  },
  pressedItem: {
    backgroundColor: '#f3f4f6',
  },
  iconContainer: {
    width: 32, // Ancho fijo para mantener alineación
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultIcon: {
    // Estilos base para todos los íconos
    color: 'black',
  },
  divider: {
    height: 1,
    backgroundColor: '#d1d5db',
    width: '100%',
    marginVertical: 16,
  },
});


export default Menu;