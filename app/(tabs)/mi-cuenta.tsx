import { Container, H2 } from '@/components/ui';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import LiveAccount from '@/components/account/LiveAccount';
import MenuAccount from '@/components/account/MenuAccount';

const AccountScreen = () => {
  const dispatch = useAppDispatch();
  const { user: myUser } = useAppSelector(state => state.user);

  return (
    <Container type="page">
      <H2>Mi cuenta</H2>
      {myUser?.role === 'manufacturer' && myUser?.manufacturer && (
        <LiveAccount 
          image={myUser.manufacturer.image}
          name={myUser.manufacturer.name}
        />
      )}
      <MenuAccount />
    </Container>
  );
};


export default AccountScreen;