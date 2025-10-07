import { Container, H2 } from '@/components/ui';
import LiveAccount from '@/components/account/LiveAccount';
import MenuAccount from '@/components/account/MenuAccount';

const AccountScreen = () => {
  return (
    <Container type="page">
      <H2>Mi cuenta</H2>
      <LiveAccount />
      <MenuAccount />
    </Container>
  );
};


export default AccountScreen;