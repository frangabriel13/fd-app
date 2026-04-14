import { View, ScrollView } from 'react-native';
import { useAppSelector } from '@/hooks/redux';
import LiveAccount from '@/components/account/LiveAccount';
import MenuAccount from '@/components/account/MenuAccount';

const AccountScreen = () => {
  const { user: myUser } = useAppSelector(state => state.user);

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {myUser?.role === 'manufacturer' && myUser?.manufacturer && (
          <LiveAccount
            image={myUser.manufacturer.image}
            live={myUser.manufacturer.live}
          />
        )}
        <MenuAccount userRole={myUser?.role} />
      </ScrollView>
    </View>
  );
};

export default AccountScreen;
