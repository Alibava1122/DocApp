import { createStackNavigator } from 'react-navigation-stack';
import { Image } from 'react-native';
import Home from '../screens/Home/Home';
import ItemList from '../screens/Items/ItemList';
import SearchList from '../screens/Items/SearchList';
import ItemDetails from '../screens/Items/ItemDetails';
import Reviews from '../screens/Items/Reviews';
import AddReview from '../screens/Items/AddReview';

import Account from '../screens/user/Account';
import EditAccount from '../screens/user/EditAccount';
import React from 'react';
import OrderReceipt from '../screens/order/OrderReceipt';
import OrderTrack from '../screens/order/OrderTrack';
import OrderHistory from '../screens/order/OrderHistory';
import Cart from '../screens/Items/Cart';
import Checkout from '../screens/Items/Checkout';
import OrderSummary from '../screens/Items/OrderSummary';
import ContactSeller from '../screens/Items/ContactSeller';

import { primaryColor } from '../common/const';

export const HomeNavigator = createStackNavigator(
  {
    Home: {
      screen: Home,
    },
    SearchList: {
      screen: SearchList,
    },
    ProductList: {
      screen: ItemList,
    },
    ProductDetails: {
      screen: ItemDetails,
    },
    ContactSeller: {
      screen: ContactSeller,
    },
    CartView: {
      screen: Cart,
    },
    OrderSummary: {
      screen: OrderSummary,
    },
    Checkout: {
      screen: Checkout,
    },
    Reviews: {
      screen: Reviews,
    },
    AddReview: {
      screen: AddReview,
    },
  },
  {
    mode: 'modal',
    // headerMode: 'none',
    navigationOptions: {
      drawerIcon: () => null,
      drawerLabel: () => null,
    },
  },
);

export const AccountNavigator = createStackNavigator(
  {
    Account: {
      screen: Account,
    },
    EditAccount: {
      screen: EditAccount,
    },
  },
  {
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{
            width: 24,
            height: 24,
            tintColor: '#2E2E2E',
          }}
          resizeMode="cover"
          resizeMethod="scale"
          source={require('../../assets/account2.png')}
        />
      ),
      drawerLabel: 'My Account',
      headerStyle: {
        height: 150,
        backgroundColor: primaryColor,
        opacity: 1,
      },
    },
  },
);

export const OrderNavigator = createStackNavigator(
  {
    Orders: {
      screen: OrderHistory,
    },
    OrderReceipt: {
      screen: OrderReceipt,
    },
    OrderTrack: {
      screen: OrderTrack,
    },
  },
  {
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{
            width: 24,
            height: 24,
            tintColor: '#2E2E2E',
          }}
          resizeMode="cover"
          resizeMethod="scale"
          source={require('../../assets/myorder.png')}
        />
      ),
      drawerLabel: 'My Orders',
      headerStyle: {
        height: 150,
        backgroundColor: primaryColor,
        opacity: 1,
      },
    },
  },
);

export const CartNavigator = createStackNavigator(
  {
    CartView: {
      screen: Cart,
    },
    Checkout: {
      screen: Checkout,
    },
  },
  {
    // mode: 'modal',
    navigationOptions: {
      drawerLabel: 'My Cart',
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{
            width: 24,
            height: 24,
            tintColor: '#2E2E2E',
          }}
          resizeMode="cover"
          resizeMethod="scale"
          source={require('../../assets/addtocard.png')}
        />
      ),
      headerStyle: {
        backgroundColor: primaryColor,
      },
    },
  },
);
