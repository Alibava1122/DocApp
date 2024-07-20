import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import * as Api from '../../api/api';
import showToast from '../../utils/toast';
import { primaryColor } from '../../common/const';
import { Button, TextInput } from '../../components';

class SignUp extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (
        <Text
          style={{
            fontSize: 23,
            marginStart: 10,
            color: '#fff',
          }}>
          {'Reset Password'}
        </Text>
      ),
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
    };
  };

  state = {
    email: '',
  };

  _resetPassword = async () => {
    if (!this.state?.email?.trim()?.length) {
      showToast('Please enter email');
      return;
    }
    if (!this.validateEmail(this.state.email.trim())) {
      showToast('Wrong email format');
      return;
    }

    try {
      const res = await Api.resetPassword(this.state.email);
      if (res.data.error) {
        showToast(res.data.error);
        return;
      }
      showToast(res.data.message);
      this.props.navigation.pop();
    } catch (err) {
      showToast(err.message);
    }
  };

  validateEmail = mail => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      mail,
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 25, width: '85%' }}>
          Lost your password? Please enter your email address. You will receive
          a link to create a new password via email.
        </Text>

        <TextInput
          value={this.state.email}
          style={styles.textInputStyles}
          focusedStyle={styles.textInputFocusedStyle}
          placeholder="Email Address"
          onChangeText={email => this.setState({ email })}
          keyboardType="email-address"
          placeholderTextColor="#000000"
        />

        <View style={{ marginTop: 35, width: '68%' }}>
          <Button
            title="RESET PASSWORD"
            slim={true}
            onPress={this._resetPassword}
          />
        </View>
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
  resetButtonStyles: {
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 35,
    width: '70%',
  },
  textInputFocusedStyle: {
    borderBottomColor: primaryColor,
    borderBottomWidth: 2,
  },
});

export default SignUp;
