import { View, Text, StyleSheet } from 'react-native';
import { Container, H2 } from '@/components/ui';
import LiveAccount from '@/components/account/LiveAccount';

const AccountScreen = () => {
  return (
    <Container type="page">
      <H2>Mi cuenta</H2>
      <LiveAccount />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});


export default AccountScreen;