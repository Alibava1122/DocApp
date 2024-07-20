import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import {
  HomeNavigator,
  AccountNavigator,
  OrderNavigator,
} from './ScreenNavigator';
import { CartNavigator } from './ScreenNavigator';
// import Wishlist from '../screens/Items/Wishlist';
import About from '../screens/meta/About';
import Exit from '../screens/meta/Exit';
import Policies from '../screens/meta/Policies';
// import Checkout from '../screens/Items/Checkout';
import Contact from '../screens/meta/Contact';
import AuthNavigator from './AuthNavigator';
import Service from './NavigationService';

import { formatAccountButtonText } from '../utils/utils';
import { primaryColor } from '../common/const';

const CustomDrawerContentComponent = ({ user, ...props }) => {
  const accountButtonText = formatAccountButtonText(user);

  const openAuth = useCallback(() => {
    if (!user?.id) {
      return Service.navigate('Auth');
    }
    Service.navigate('Account');
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.navImageContainer}>
          <Image
            resizeMode="contain"
            style={{ width: '80%' }}
            source={require('../../assets/edental.png')}
          />
        </View>
        <TouchableOpacity
          onPress={openAuth}
          style={{
            backgroundColor: primaryColor,
            padding: 10,
            paddingStart: 15,
            marginBottom: 2,
          }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>
            {accountButtonText}
          </Text>
        </TouchableOpacity>
        <DrawerItems {...props} />
      </ScrollView>
      <StatusBar backgroundColor={'#00574B'} barStyle={'light-content'} />
    </SafeAreaView>
  );
};
const mapStateToProps = ({ user: { user = {} } }) => {
  return {
    user,
  };
};

const ReduxWrappedComponent = connect(mapStateToProps)(
  CustomDrawerContentComponent,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 110,
  },
});

export default createDrawerNavigator(
  {
    Home: {
      screen: HomeNavigator,
    },
    Account: {
      screen: AccountNavigator,
    },
    Auth: {
      screen: AuthNavigator,
    },
    Order: {
      screen: OrderNavigator,
    },
    cart: {
      screen: CartNavigator,
    },
    // wishlist: {
    //   screen: Wishlist
    // },
    Contact: {
      screen: Contact,
    },
    Policies: {
      screen: Policies,
    },
    About: {
      screen: About,
    },
    Exit: {
      screen: Exit,
    },
  },
  {
    contentComponent: ReduxWrappedComponent,
  },
);
