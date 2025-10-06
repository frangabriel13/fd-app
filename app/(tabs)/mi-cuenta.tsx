import { View, Text, StyleSheet } from 'react-native';
import { Container, H2 } from '@/components/ui';

const AccountScreen = () => {
  return (
    <Container type="page">
      <H2>Mi cuenta</H2>
      <Text>Contenido de packs y combos aquí</Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});


export default AccountScreen;