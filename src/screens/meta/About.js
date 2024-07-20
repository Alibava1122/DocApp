import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import pkg from '../../../package.json';

const appVersion = pkg.version;

import { createStackNavigator } from 'react-navigation-stack';

const primaryColor = '#008577';
class About extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (
        <Text
          style={{
            fontSize: 23,
            marginStart: 10,
            color: '#fff',
          }}>
          About
        </Text>
      ),
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
      headerLeft: () => (
        //navigation.openDrawer()
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image
            style={{
              width: 25,
              height: 25,
              marginStart: 20,
            }}
            resizeMode="cover"
            resizeMethod="scale"
            source={require('../../../assets/back-arrow.png')}
          />
        </TouchableOpacity>
      ),
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          style={{
            height: '8%',
            alignSelf: 'center',
            marginTop: 70,
            marginBottom: 70,
          }}
          source={require('../../../assets/edental.png')}
        />

        <Text style={{ width: '85%', alignSelf: 'center', color: 'black' }}>
          E-Dental Mart is Pakistan’s first online dental store, which provides
          the reasonable prices of all dental products with assurance of
          originality and quality. We provide a platform to dentists, dental
          students and lab personnels to find the complete range of dental
          products and supplies at affordables price under one roof.
        </Text>

        <Text
          style={{
            marginTop: 60,
            fontSize: 17,
            color: primaryColor,
            alignSelf: 'center',
          }}>
          {`Version No. ${appVersion}`}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default createStackNavigator(
  {
    About: {
      screen: About,
    },
  },
  {
    navigationOptions: {
      drawerLabel: 'About',
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{
            width: 24,
            height: 24,
            tintColor: '#2E2E2E',
          }}
          resizeMode="cover"
          resizeMethod="scale"
          source={require('../../../assets/help.png')}
        />
      ),
      headerStyle: {
        backgroundColor: primaryColor,
      },
    },
  },
);
