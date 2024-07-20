import React, { Component } from 'react';
import { Image } from 'react-native';
import RNExitApp from 'react-native-exit-app';


export default class Contact extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLabel: 'Exit',
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{
            width: 24,
            height: 24,
            tintColor: '#2E2E2E',
          }}
          resizeMode="contain"
          resizeMethod="scale"
          source={require('../../../assets/exit35.png')}
        />
      ),
    };
  };

  render() {
    RNExitApp.exitApp();
    return null;
  }
}
