import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  SafeAreaView,
  Pressable,
  Platform,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import LatestItems from './LatestItems';
import Categories from './Categories';

import { NavigationEvents } from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';
import { updateSearchText } from '../../redux/search/actions';
import { primaryColor } from '../../common/const';
import { HeaderTitle, CartButton } from '../../components';
import { preloadCategories } from '../../redux/categories/actions';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    // const TOKEN = await messaging().getToken();
  }
}

class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle />,
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            fadeDuration={0}
            style={{
              width: 25,
              height: 25,
              marginStart: 20,
            }}
            resizeMode="cover"
            resizeMethod="scale"
            source={require('../../../assets/md-menu.png')}
          />
        </TouchableOpacity>
      ),
      headerRight: () => <CartButton />,
    };
  };

  componentDidMount() {
    this.onFocus();
    this.props.isRehydrated && this.props.preloadCategories();
    requestUserPermission();
  }

  componentDidUpdate(prevProps) {
    if (!!this.props.isRehydrated && !prevProps.isRehydrated) {
      this.props.preloadCategories();
    }
  }

  onFocus = () => {
    this.props.clearSearchText();
  };

  onSearchPress = () => {
    this.props.navigation.navigate('SearchList');
  };

  render() {
    return (
      <SafeAreaView
        style={{ backgroundColor: '#eee', flex: 1, alignSelf: 'stretch' }}>
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            alignSelf: 'stretch',
            backgroundColor: '#eee',
          }}>
          <NavigationEvents onDidFocus={payload => this.onFocus()} />
          <View
            style={{
              width: '100%',
              height: '100%',
              paddingTop: 15,
              backgroundColor: '#eee',
              alignItems: 'center',
            }}>
            <Pressable onPress={this.onSearchPress}>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  editable={false}
                  pointerEvents={'none'}
                  numberOfLines={1}
                  placeholder="search items..."
                />
                <Image
                  fadeDuration={0}
                  style={styles.searchIconImageStyle}
                  resizeMode="contain"
                  source={require('../../../assets/search.png')}
                />
              </View>
            </Pressable>

            <Categories />
            <LatestItems />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = EStyleSheet.create({
  searchInputContainer: {
    width: '73%',
    height: 40,
    paddingStart: 5,
    paddingEnd: 10,
    marginEnd: 5,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  searchIconImageStyle: {
    width: 20,
    height: 20,
  },
});

const mapStateToProps = ({ categories: { isRehydrated } }) => {
  return {
    isRehydrated,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearSearchText: () => dispatch(updateSearchText('')),
    preloadCategories: () => dispatch(preloadCategories()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
