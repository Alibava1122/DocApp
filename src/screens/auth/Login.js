import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { loginUser } from '../../redux/user/actions';
import { clearCartProducts } from '../../redux/cart/actions';
import CheckBox from '@react-native-community/checkbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import showToast from '../../utils/toast';
import { Button, TextInput, HeaderTitle } from '../../components';
import { primaryColor } from '../../common/const';

const defaultState = {
  rememberAuth: true,
  email: '',
  password: '',
};

class Login extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle />,
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
      headerTintColor: 'white',
      headerLeft: () => (
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

  state = {
    ...defaultState,
  };

  rememberClicked = () => {
    this.setState({
      rememberAuth: !this.state.rememberAuth,
    });
  };

  validateEmail = mail => {
    try {
      if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          mail,
        )
      ) {
        return true;
      }
      return false;
    } catch (err) {
      console.log('validateEmail -> err', err);
    }
    return true;
  };

  validateInput = (ignoreToast = false) => {
    if (
      !this.state?.email?.trim()?.length &&
      !this.state?.password?.trim()?.length
    ) {
      showToast('Input is required');
      return false;
    }
    if (!this.state?.email?.trim()?.length) {
      showToast('Please enter email');
      return false;
    }
    if (!this.validateEmail(this.state.email)) {
      !ignoreToast && showToast('Invalid Email');
      return false;
    }
    if (!this.state?.password?.trim()?.length) {
      showToast('Please enter password');
      return false;
    }
    return true;
  };

  _login = async () => {
    if (!this.validateInput()) return;

    try {
      await this.props.dispatch(
        loginUser({
          username: this.state.email,
          password: this.state.password,
        }),
      );
      this.props.dispatch(clearCartProducts());
      this.setState({ ...defaultState });
      this.props.navigation.navigate('Home');
    } catch (e) {
      showToast(
        e.message === 'Network Error' ? 'No Network Connection' : e.message,
      );
    }
  };

  _onChangeText = (value, key) => {
    try {
      this.setState({
        [key]: value,
      });
    } catch (err) {
      console.log('_onChangeText -> err', err);
    }
  };

  _signUp = () => {
    this.props.navigation.navigate('SignUp');
  };

  _forgotPassword = () => {
    this.props.navigation.navigate('ResetPassword');
  };

  render() {
    const { rememberAuth } = this.state;
    const { loading } = this.props;
    return (
      <View style={styles.container}>
        <Image
          style={{ width: '50%', marginTop: 35, marginBottom: 5 }}
          resizeMode="contain"
          source={require('../../../assets/edental.png')}
        />

        <KeyboardAwareScrollView style={{ width: '100%' }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <TextInput
              value={this.state.email}
              style={styles.textInputStyles}
              focusedStyle={styles.textInputFocusedStyle}
              placeholder="Email Address"
              onChangeText={value => this._onChangeText(value, 'email')}
              keyboardType="email-address"
              placeholderTextColor="#000000"
            />

            <TextInput
              value={this.state.password}
              style={[styles.textInputStyles]}
              focusedStyle={styles.textInputFocusedStyle}
              placeholder="Password"
              secureTextEntry={true}
              textContentType={'password'}
              autoCompleteType={'password'}
              placeholderTextColor="#000000"
              onChangeText={value => this._onChangeText(value, 'password')}
            />

            <View style={styles.forgotPassContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CheckBox
                  boxType={'square'}
                  style={Platform.select({
                    ios: {
                      height: 20,
                    },
                    android: {},
                  })}
                  onCheckColor={primaryColor}
                  onTintColor={primaryColor}
                  value={rememberAuth}
                  onValueChange={this.rememberClicked}
                />
                <Text style={{ marginStart: '1%', color: 'black' }}>
                  {'Remember Me'}
                </Text>
              </View>
              <Text onPress={this._forgotPassword} style={{ color: 'black' }}>
                {'Lost your Password?'}
              </Text>
            </View>

            <View style={{ marginTop: 35, width: '68%' }}>
              <Button
                title="LOG IN"
                loader={loading}
                slim={true}
                onPress={this._login}
              />
            </View>

            <Text
              onPress={this._signUp}
              style={{
                marginTop: 20,
                fontSize: 16,
                fontWeight: '400',
                color: '#008477',
              }}>
              {'Create an account'}
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  forgotPassContainer: {
    alignSelf: 'stretch',
    paddingStart: '10%',
    paddingEnd: '10%',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textInputStyles: {
    width: '85%',
    borderBottomColor: '#999',
    textAlignVertical: 'bottom',
    textAlign: 'left',
    height: 35,
    marginTop: 10,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    paddingBottom: 4,
    paddingLeft: 0,
  },
  textInputFocusedStyle: {
    borderBottomColor: primaryColor,
    borderBottomWidth: 2,
  },
});

const mapStateToProps = ({ user: { user, loading } }) => {
  return {
    user,
    loading,
  };
};

export default connect(mapStateToProps)(Login);
