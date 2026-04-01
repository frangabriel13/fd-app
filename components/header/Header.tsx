import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from './Logo';
import Notification from './Notification';
import Search from './Search';

const Header = () => {
  const insets = useSafeAreaInsets();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <View style={{ paddingTop: insets.top + 6 }} className='bg-primary px-3 pb-2.5 flex-row items-center gap-2.5'>
      {!isSearchExpanded && (
        <View className='w-9 items-center'>
          <Logo />
        </View>
      )}
      <Search
        isExpanded={isSearchExpanded}
        onExpandChange={setIsSearchExpanded}
      />
      {!isSearchExpanded && (
        <View className='w-9 items-center'>
          <Notification />
        </View>
      )}
    </View>
  );
}

export default Header;
