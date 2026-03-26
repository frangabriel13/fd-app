import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from './Logo';
import Notification from './Notification';
import Search from './Search';

const Header = () => {
  const insets = useSafeAreaInsets();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]} className='bg-primary'>
      {!isSearchExpanded && (
        <View style={styles.logoContainer}>
          <Logo />
        </View>
      )}
      <Search
        isExpanded={isSearchExpanded}
        onExpandChange={setIsSearchExpanded}
      />
      {!isSearchExpanded && (
        <View style={styles.notifContainer}>
          <Notification />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoContainer: {
    width: 36,
    alignItems: 'center',
  },
  notifContainer: {
    width: 36,
    alignItems: 'center',
  },
});

export default Header;
