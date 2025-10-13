import { Container, H2 } from '@/components/ui';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import LiveAccount from '@/components/account/LiveAccount';
import MenuAccount from '@/components/account/MenuAccount';

const AccountScreen = () => {
  const dispatch = useAppDispatch();
  const { user: myUser } = useAppSelector(state => state.user);

  return (
    <Container type="page">
      {myUser?.role === 'manufacturer' && myUser?.manufacturer && (
        <LiveAccount 
          image={myUser.manufacturer.image}
          live={myUser.manufacturer.live}
        />
      )}
      <MenuAccount userRole={myUser?.role} />
    </Container>
  );
};


export default AccountScreen;