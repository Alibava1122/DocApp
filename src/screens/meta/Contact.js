import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Linking,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { HeaderTitle } from '../../components';
import { primaryColor } from '../../common/const';

const ContactButton = ({ image, text, link, smallImage }) => {
  const onPress = () => {
    Linking.canOpenURL(link).then(result => {
      !!result && Linking.openURL(link);
    });
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 30,
          alignItems: 'center',
        }}>
        <View style={{ width: 40, height: 40, marginRight: 20 }}>
          <Image
            style={
              smallImage ? { width: 35, height: 35 } : { width: 40, height: 40 }
            }
            resizeMode={'cover'}
            source={image}
          />
        </View>
        <Text
          style={{ fontSize: 18, fontWeight: '600', color: primaryColor }}
          selectable={true}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

class Contact extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={'Contact Us'} />,
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
      drawerLabel: 'Contact Us',
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{
            width: 24,
            height: 24,
            tintColor: '#2E2E2E',
          }}
          resizeMode="cover"
          resizeMethod="scale"
          source={require('../../../assets/phone.png')}
        />
      ),
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
      <SafeAreaView style={styles.container}>
        <Image
          resizeMode="contain"
          style={{
            height: '8%',
            alignSelf: 'center',
            marginTop: 70,
            marginBottom: 60,
          }}
          source={require('../../../assets/edental.png')}
        />

        <View style={{ marginTop: 0, paddingHorizontal: 20 }}>
          <ContactButton
            text={'Phone: 0304 111 0244'}
            link={'tel:03041110244'}
            image={require('../../../assets/phone-icon.png')}
            smallImage
          />
          <ContactButton
            text={'Email: info@edentalmart.com'}
            link={'mailto:info@edentalmart.com'}
            image={require('../../../assets/email-icon.png')}
            smallImage
          />
          <ContactButton
            text={'Whatsapp: +92 309 444 3150'}
            link={'whatsapp://send?phone=+923094443150'}
            image={require('../../../assets/icon-whatsapp.png')}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default createStackNavigator(
  {
    Contact: {
      screen: Contact,
    },
  },
  {
    navigationOptions: {
      drawerLabel: 'Contact Us',
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{
            width: 24,
            height: 24,
            tintColor: '#2E2E2E',
          }}
          resizeMode="cover"
          resizeMethod="scale"
          source={require('../../../assets/phone.png')}
        />
      ),
      headerStyle: {
        backgroundColor: primaryColor,
      },
    },
  },
);
