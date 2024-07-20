import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Picker,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { updateUserData } from '../../redux/user/actions';
import countries from '../../utils/countries';
import showToast from '../../utils/toast';
import { primaryColor, primaryDarkColor } from '../../common/const';
import { HeaderTitle, Button, TextInput } from '../../components';

const state = ['', 'Punjab', 'Sindh', 'Balochistan', 'Khyber-Pakhtunkhwa'];
const cities = [
  '',
  'Lahore',
  'Karachi',
  'Islamabad',
  'Peshawar',
  'Multan',
  'Quetta',
  'Faisalabad',
  'Rawalpindi',
  'Hyderabad',
  'Gujuranwala',
  'Sialkot',
  'Bahawalpur',
  'Sukkur',
  'Sargodha',
  'Abbottabad',
  'Kasur',
  'Gujrat',
  'Sheikhupura',
  'Larkana',
  'Sahiwal',
  'Mardan',
  'Gawader',
];

const TextInputForm = ({
  title = '',
  value,
  onChangeText,
  keyboardType = 'default',
  required = false,
  style = {},
}) => (
  <View style={{ marginTop: 15 }}>
    <Text style={styles.headerText}>
      {title}
      {!!required && (
        <Text style={[styles.headerText, { color: 'red' }]}>{' *'}</Text>
      )}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[styles.textInput, style]}
      focusedStyle={styles.textInputFocusedStyle}
      keyboardType={keyboardType}
    />
  </View>
);

const PickerForm = ({
  title = '',
  value,
  options = [],
  onValueChange,
  required = false,
}) => (
  <View style={{ marginTop: 15 }}>
    <Text style={styles.headerText}>
      {title}
      {!!required && (
        <Text style={[styles.headerText, { color: 'red' }]}>{' *'}</Text>
      )}
    </Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={value}
        style={styles.pickerStyles}
        itemStyle={styles.itemStyles}
        onValueChange={onValueChange}>
        {options.map((item, index) => {
          const label = typeof item === 'string' ? item : item?.name;
          return <Picker.Item key={'' + index} label={label} value={label} />;
        })}
      </Picker>
    </View>
  </View>
);

class EditAccount extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={'Edit Profile'} />,
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
    };
  };

  state = {
    firstName: '',
    lastName: '',
    company: '',
    country: '',
    address: '',
    city: '',
    state: '',
    phone: '',
  };

  constructor(props) {
    super(props);
    const userData = props.user;
    this.state = {
      firstName: userData.first_name,
      lastName: userData.last_name,
      company: userData.billing.company,
      email: userData.email,
      country: userData.billing.country,
      address: userData.billing.address_1 + ' ' + userData.billing.address_2,
      city: userData.billing.city,
      state: userData.billing.state,
      phone: userData.billing.phone,
    };
  }

  _onTextChange = (key, value) => {
    this.setState({ [key]: value });
  };

  validateData = () => {
    if (this.state.firstName.trim().length == 0) {
      showToast('First name cannot be empty');
      return false;
    }
    if (this.state.lastName.trim().length == 0) {
      showToast('Last name cannot be empty');

      return false;
    }
    if (this.state.country.trim().length == 0) {
      showToast('Country cannot be empty');
      return false;
    }

    if (this.state.address.trim().length == 0) {
      showToast('Address cannot be empty');
      return false;
    }
    if (this.state.city.trim().length == 0) {
      showToast('City cannot be empty');
      return false;
    }
    if (this.state.state.trim().length == 0) {
      showToast('State cannot be empty');
      return false;
    }
    if (this.state.phone.trim().length == 0) {
      showToast('Phone cannot be empty');
      return false;
    }

    return true;
  };

  _save = async () => {
    if (!this.validateData()) {
      return;
    }

    const billing = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      company: this.state.company,
      address_1: this.state.address,
      city: this.state.city,
      state: this.state.state,
      country: this.state.country,
      phone: this.state.phone,
    };

    const shipping = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      company: this.state.company,
      address_1: this.state.address,
      city: this.state.city,
      state: this.state.state,
      country: this.state.country,
    };

    const data = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      billing,
      shipping,
    };

    try {
      await this.props.dispatch(updateUserData(data));
      showToast('Data updated successfully.');
    } catch (error) {
      // console.log(error);
      showToast(
        error.message === 'Network Error'
          ? 'No Network Connection'
          : 'Update failed, try again.',
      );
    }
  };

  render() {
    const { loading } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={85}
          style={{ flex: 1 }}
          behavior={'height'}>
          <ScrollView>
            <View style={styles.container}>
              <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <View style={{ flex: 0.5 }}>
                  <TextInputForm
                    title="First Name"
                    value={this.state.firstName}
                    onChangeText={text => this._onTextChange('firstName', text)}
                    style={{ marginTop: 0 }}
                    required={true}
                  />
                </View>
                <View style={{ flex: 0.5 }}>
                  <TextInputForm
                    title="Last Name"
                    value={this.state.lastName}
                    onChangeText={text => this._onTextChange('lastName', text)}
                    style={{ marginTop: 0 }}
                    required={true}
                  />
                </View>
              </View>

              <TextInputForm
                title="Company Name (optional)"
                value={this.state.company}
                onChangeText={text => this._onTextChange('company', text)}
                required={false}
              />

              {/* <View style={{ marginTop: 15 }}>
                <Text style={styles.headerText}>{'Email'}</Text>
                <TextInput
                  value={this.state.email}
                  onChangeText={(text) => this._onTextChange('email', text)}
                  style={styles.textInput}
                  focusedStyle={styles.textInputFocusedStyle}
                />
              </View> */}

              <PickerForm
                title="Country"
                value={this.state.country}
                options={countries}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ country: itemValue })
                }
                required={true}
              />

              <TextInputForm
                title="Street Address"
                value={this.state.address}
                onChangeText={text => this._onTextChange('address', text)}
                required={true}
              />

              <PickerForm
                title="City"
                value={this.state.city}
                options={cities}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ city: itemValue })
                }
                required={true}
              />

              <PickerForm
                title="State"
                value={this.state.state}
                options={state}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ state: itemValue })
                }
                required={true}
              />

              <TextInputForm
                title="Phone No."
                value={this.state.phone}
                keyboardType="phone-pad"
                onChangeText={text => this._onTextChange('phone', text)}
                required={true}
              />

              <View>
                {!!loading && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    <ActivityIndicator size="large" color={primaryColor} />
                  </View>
                )}
              </View>

              {!loading && (
                <Button
                  onPress={this._save}
                  title={'SAVE'}
                  style={styles.saveButtonContainer}
                  slim={true}
                />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  textInput: {
    width: '95%',
    borderBottomColor: '#444',
    fontSize: 17,
    marginTop: 10,
    paddingBottom: 1,
    borderBottomWidth: 1,
  },
  textInputFocusedStyle: {
    borderBottomColor: primaryDarkColor,
    borderBottomWidth: 2,
    paddingBottom: 0,
  },
  headerText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginLeft: 2,
  },
  saveButtonContainer: {
    width: '60%',
    marginTop: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '95%',
    borderBottomColor: '#444',
    justifyContent: 'flex-start',
    paddingTop: 10,
    borderBottomWidth: 1,
  },
  pickerStyles: {
    height: 40,
    width: '100%',
    marginStart: -5,
    color: '#000000',
    backgroundColor: '#fff',
    fontSize: 17,
  },
  itemStyles: {
    padding: 0,
    margin: 0,
  },
});

const mapStateToProps = ({ user: { user = {}, loading } }) => {
  return {
    user,
    loading,
  };
};

export default connect(mapStateToProps, null)(EditAccount);
