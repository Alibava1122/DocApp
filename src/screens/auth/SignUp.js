import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { createUser } from '../../redux/user/actions';
import { clearCartProducts } from '../../redux/cart/actions';
import showToast from '../../utils/toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, TextInput, HeaderTitle } from '../../components';
import { primaryColor } from '../../common/const';

const defaultState = {
  rememberAuth: true,
  email: '',
  password: '',
};

class SignUp extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle />,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
    };
  };

  state = { ...defaultState };

  validateEmail = mail => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail,
      )
    ) {
      return true;
    }
    return false;
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

    if (
      !this.state?.email?.trim()?.length ||
      !this.validateEmail(this.state.email)
    ) {
      !ignoreToast && showToast('Invalid Email');
      return false;
    }

    if (!this.state?.password?.trim()?.length) {
      showToast('Please enter password');
      return false;
    }
    return true;
  };

  _register = async () => {
    if (!this.validateInput()) return;
    try {
      const { email, password } = this.state;
      await this.props.dispatch(createUser({ email, password }));
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
    this.setState({
      [key]: value,
    });
  };

  render() {
    const { loading } = this.props;
    return (
      <View style={styles.container}>
        <Image
          style={{ width: '50%', marginTop: 35 }}
          resizeMode="contain"
          source={require('../../../assets/edental.png')}
        />

        <KeyboardAwareScrollView style={{ width: '100%' }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <TextInput
              value={this.state.email}
              style={[styles.textInputStyles, { marginTop: 15 }]}
              focusedStyle={styles.textInputFocusedStyle}
              placeholder="Email Address"
              onChangeText={value => this._onChangeText(value, 'email')}
              keyboardType="email-address"
              placeholderTextColor="#000000"
            />

            <TextInput
              value={this.state.password}
              style={[styles.textInputStyles, { marginTop: 20 }]}
              focusedStyle={styles.textInputFocusedStyle}
              placeholder="Password"
              secureTextEntry={true}
              textContentType={'password'}
              autoCompleteType={'password'}
              placeholderTextColor="#000000"
              onChangeText={value => this._onChangeText(value, 'password')}
            />

            <View style={{ marginTop: 28, width: '68%' }}>
              <Button
                title="REGISTER"
                loader={loading}
                slim={true}
                onPress={this._register}
              />
            </View>
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
  registerButtonStyles: {
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 35,
    width: '60%',
  },
});

const mapStateToProps = ({ user: { user, loading } }) => {
  return {
    user,
    loading,
  };
};
export default connect(mapStateToProps)(SignUp);
