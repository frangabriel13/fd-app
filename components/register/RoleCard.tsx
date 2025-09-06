import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { H2 } from '@/components/ui';

const RoleCard = ({
  role,
  title,
  image,
}: {
  role: 'mayorista' | 'fabricante';
  title: string;
  image: any;
}) => {
  return (
    <TouchableOpacity
      onPress={() => setSelectedRole(role)}
      className="border p-4 rounded-lg"
    >
      <Image source={image} style={{ width: 100, height: 100 }} />
      <H2>{title}</H2>
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     padding: 0,
//   },
// });


export default RoleCard;