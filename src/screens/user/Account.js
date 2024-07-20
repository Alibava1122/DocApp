import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { loadUserData } from '../../redux/user/actions';
import showToast from '../../utils/toast';
import { logoutUser } from '../../redux/user/actions';
import { clearCartProducts } from '../../redux/cart/actions';
import { NavigationEvents } from 'react-navigation';
import { primaryColor } from '../../common/const';
import {
  HeaderTitle,
  HeaderBackButton,
  EditButton,
  Button,
} from '../../components';

class Account extends Component {
  constructor(props) {
    super(props);
    this.focusListener = this.props.navigation.addListener(
      'willFocus',
      payload => {
        if (!this.props.user?.id) {
          this.props.navigation.dangerouslyGetParent().navigate('Auth');
        }
      },
    );
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={'Account'} />,
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
      headerLeft: () => (
        <HeaderBackButton onPress={() => navigation.navigate('Home')} />
      ),
    };
  };

  _editAccount = () => {
    if (this.props.user?.id) {
      return this.props.navigation.navigate('EditAccount');
    }

    this.props.navigation.dangerouslyGetParent().navigate('Auth');
  };

  componentDidMount() {
    this.props.dispatch(loadUserData());
  }

  _signOut = async () => {
    try {
      await this.props.dispatch(logoutUser());
      this.props.dispatch(clearCartProducts());
      this.props.navigation.dangerouslyGetParent().goBack();
    } catch (error) {
      console.log('_signOut -> error', error);
      showToast(
        error.message === 'Network Error'
          ? 'No Network Connection'
          : error.message,
      );
    }
  };

  render() {
    const {
      user: { first_name = '', last_name = '', email = '', billing = {} } = {},
      loading,
    } = this.props;

    let billingAddress = billing?.address_1 || '';
    if (!!billing?.address_2) {
      billingAddress += ` ${billing.address_2}`;
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <NavigationEvents onDidFocus={payload => this.componentDidMount()} />
          <View style={styles.container}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              <Text style={[styles.headerText, { marginLeft: 5 }]}>
                {'ACCOUNT INFO'}
              </Text>
              <EditButton onPress={this._editAccount} />
            </View>

            <View>
              <View style={{ flexDirection: 'row', marginTop: 40 }}>
                <View style={{ flex: 0.5 }}>
                  <Text style={styles.headerText}>{'First Name'}</Text>
                  <Text style={styles.regularText}>{first_name}</Text>
                </View>
                <View style={{ flex: 0.5 }}>
                  <Text style={styles.headerText}>{'Last Name'}</Text>
                  <Text style={styles.regularText}>{last_name}</Text>
                </View>
              </View>

              {!!billing?.company && (
                <View style={{ marginTop: 15 }}>
                  <Text style={styles.headerText}>{'Company Name'}</Text>
                  <Text style={styles.regularText}>{billing.company}</Text>
                </View>
              )}

              <View style={{ marginTop: 15 }}>
                <Text style={styles.headerText}>{'Email'}</Text>
                <Text style={styles.regularText}>{email}</Text>
              </View>

              <View style={{ marginTop: 15 }}>
                <Text style={styles.headerText}>{'Country'}</Text>
                <View>
                  {loading ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <ActivityIndicator size="large" color={primaryColor} />
                    </View>
                  ) : (
                    <Text style={styles.regularText}>
                      {billing?.country || ''}
                    </Text>
                  )}
                </View>
              </View>

              <View style={{ marginTop: 15 }}>
                <Text style={styles.headerText}>{'Address'}</Text>
                {!!billingAddress && (
                  <Text style={styles.regularText}>{billingAddress}</Text>
                )}
              </View>

              <View style={{ marginTop: 15 }}>
                <Text style={styles.headerText}>{'City'}</Text>
                {!!billing?.city && (
                  <Text style={styles.regularText}>{billing.city}</Text>
                )}
              </View>

              <View style={{ marginTop: 15 }}>
                <Text style={styles.headerText}>{'State'}</Text>
                {!!billing?.state && (
                  <Text style={styles.regularText}>{billing.state}</Text>
                )}
              </View>

              <View style={{ marginTop: 15 }}>
                <Text style={styles.headerText}>{'Phone'}</Text>
                {!!billing?.phone && (
                  <Text style={styles.regularText}>{billing.phone}</Text>
                )}
              </View>
            </View>

            {!loading && (
              <Button
                onPress={this._signOut}
                title={'SIGN OUT'}
                style={styles.signOutButtonContainer}
                slim={true}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  signOutButtonContainer: {
    width: '60%',
    marginTop: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regularText: {
    fontSize: 14,
    color: '#767676',
    marginTop: 10,
  },
});

const mapStateToProps = ({ user: { user = {}, loading } }) => {
  return {
    user,
    loading,
  };
};

export default connect(mapStateToProps)(Account);
