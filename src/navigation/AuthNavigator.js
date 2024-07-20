import React from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
// import { Ionicons as Icon } from "@expo/vector-icons";
import Login from '../screens/auth/Login';
import SignUp from '../screens/auth/SignUp';
import ResetPassword from '../screens/auth/ResetPassword';

export default createStackNavigator(
  {
    Login: {
      screen: Login,
    },
    SignUp: {
      screen: SignUp,
    },
    ResetPassword: {
      screen: ResetPassword,
    },
  },
  {
    navigationOptions: {
      drawerIcon: () => null,
      drawerLabel: () => null,
    },
  },
);
