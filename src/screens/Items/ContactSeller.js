import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  Linking,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { HeaderTitle, Styles, SmartImage } from '../../components';
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

class ContactSeller extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={'Contact Seller'} />,
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
      drawerLabel: 'Contact Seller',
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
        <TouchableOpacity onPress={() => navigation.pop()}>
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
        <ScrollView style={{ marginTop: 30, paddingHorizontal: 20 }}>
          <Text
            style={{
              ...Styles.normalText,
              fontSize: 18,
              fontWeight: '600',
              color: primaryColor,
              marginBottom: 15,
            }}>
            {'Product: '}
            <Text
              style={{ color: '#555555', fontSize: 18, fontWeight: '600' }}
              onPress={() => {
                const link = this.props.navigation.getParam('link');
                Linking.canOpenURL(link).then(result => {
                  if (result) {
                    Linking.openURL(link);
                  }
                });
              }}>
              {this.props.navigation.getParam('link')}
            </Text>
          </Text>

          <SmartImage
            uri={this.props.navigation.getParam('image')}
            style={{ width: 120, height: 120, alignSelf: 'center' }}
          />

          <Text
            style={{
              color: '#555555',
              fontSize: 18,
              marginVertical: 40,
              marginHorizontal: '15%',
              textAlign: 'center',
              fontWeight: '600',
            }}>
            {'How would you like to contact the seller for this product ?'}
          </Text>

          <ContactButton
            text={'Phone: 0304 111 0244'}
            link={'tel:03041110244'}
            image={require('../../../assets/phone-icon.png')}
            smallImage
          />
          <ContactButton
            text={'Email: sales@edentalmart.com'}
            link={`mailto:sales@edentalmart.com?subject=${this.props.navigation.getParam(
              'emailSubject',
            )}&body=${this.props.navigation.getParam('emailText')}`}
            image={require('../../../assets/email-icon.png')}
            smallImage
          />
          <ContactButton
            text={'Whatsapp: +92 309 444 3150'}
            link={`whatsapp://send?phone=+923094443150&text=${this.props.navigation.getParam(
              'link',
            )}`}
            image={require('../../../assets/icon-whatsapp.png')}
          />
        </ScrollView>
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

export default ContactSeller;
