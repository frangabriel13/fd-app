import { Container } from '@/components/ui';
import { useAppSelector } from '@/hooks/redux';
import LiveAccount from '@/components/account/LiveAccount';
import MenuAccount from '@/components/account/MenuAccount';

const AccountScreen = () => {
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