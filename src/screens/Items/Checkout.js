import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { TextField } from '@ubaids/react-native-material-textfield';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Header } from 'react-navigation-stack';
import { isIphoneX } from 'react-native-iphone-x-helper';

import showToast from '../../utils/toast';
import { Button, HeaderTitle } from '../../components';
import * as Api from '../../api/api';
// import { formatPrice } from '../../utils/utils';
import { primaryColor } from '../../common/const';
import { clearCartProducts } from '../../redux/cart/actions';
import { addOrder } from '../../redux/orders/actions';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Checkout' })],
  // actions: [NavigationActions.navigate({ routeName: 'CartView' })],
});

function buildMetaData(item = {}) {
  const metaData = [];
  if (item?.options?.size) {
    metaData.push({ key: 'size', value: item?.options?.size, label: 'Size' });
  }
  if (item?.options?.color) {
    metaData.push({
      key: 'color',
      value: item?.options?.color,
      label: 'Color',
    });
  }
  if (item?.options?.type) {
    metaData.push({ key: 'type', value: item?.options?.type, label: 'Type' });
  }

  return metaData;
}

function getNumber(value) {
  try {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    if (typeof value === 'number') {
      return value;
    }
  } catch {}
  return 0;
}

const SHIPPING_TYPES = {
  NORMAL: 'NORMAL',
  URGENT: 'URGENT',
};

function getShippingOptionValue(type = SHIPPING_TYPES.NORMAL, weight = 0) {
  const flyer_fee = 25;
  if (type === SHIPPING_TYPES.NORMAL) {
    const delivery_fee = 220;
    if (weight < 1) {
      return delivery_fee + flyer_fee;
    }
    if (weight >= 1) {
      return delivery_fee * weight + flyer_fee;
    }
  }
  if (type === SHIPPING_TYPES.URGENT) {
    const delivery_fee = 310;
    const extra_delivery_fee = 230;
    if (weight < 1) {
      return delivery_fee + flyer_fee;
    }
    if (weight === 1) {
      return delivery_fee * weight + flyer_fee;
    }
    if (weight > 1) {
      let cart_weight = Math.max(0, weight - 1);
      cart_weight = Math.ceil(cart_weight);
      let final_rate = cart_weight * extra_delivery_fee;
      final_rate = final_rate + delivery_fee;
      final_rate = final_rate + flyer_fee;
      return final_rate;
    }
  }

  return 0;
}

class Checkout extends Component {
  static navigationOptions = ({ navigation }) => {
    // const { params = {} } = navigation.state;
    return {
      // headerLeft: params.disableBack ? () => null : undefined,
      headerTitle: () => <HeaderTitle />,
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
    };
  };

  state = {
    firstName: this.props.user?.first_name || '',
    lastName: this.props.user?.last_name || '',
    address: `${this.props.user?.billing?.address_1 || ''} ${
      this.props.user?.billing?.address_2 || ''
    }`.trim(),
    city: this.props.user?.billing?.city || '',
    state: this.props.user?.billing?.state || '',
    email: this.props.user?.email || '',
    phone: this.props.user?.billing?.phone || '',
    additionalInformation: '',
    loading: false,
    oderSuccess: false,
    orderReceipt: '',
    selectedShippingOption: 0,
  };

  getShippingDetails = () => {
    const { city } = this.state;
    if (city) {
      if (city.toLowerCase() === 'lahore') {
        const shipping = 150;
        return {
          shipping,
          shippingOptions: [
            {
              label: `Local Delivery (1-2 working days) : ${shipping} PKR`,
              value: shipping,
            },
          ],
          localDelivery: true,
        };
      }

      const cartWeight =
        this.props.products.reduce((totalWeight, product) => {
          const productWeight = getNumber(product.weight);
          return totalWeight + productWeight;
        }, 0) / 1000;

      return {
        shipping: getShippingOptionValue(SHIPPING_TYPES.NORMAL, cartWeight),
        shippingOptions: [
          {
            label: `Normal Delivery (2-5 working days) : ${getShippingOptionValue(
              SHIPPING_TYPES.NORMAL,
              cartWeight,
            )} PKR`,
            value: getShippingOptionValue(SHIPPING_TYPES.NORMAL, cartWeight),
          },
          {
            label: `Urgent Delivery (1-2 working days) : ${getShippingOptionValue(
              SHIPPING_TYPES.URGENT,
              cartWeight,
            )} PKR`,
            value: getShippingOptionValue(SHIPPING_TYPES.URGENT, cartWeight),
          },
        ],
      };
    }

    return {
      shipping: 0,
      shippingOptions: [],
    };
  };

  containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }

  validateData = () => {
    const errors = {};
    if (this.state.firstName.trim().length == 0) {
      errors.firstNameError = 'First name cannot be empty';
    }
    if (this.state.lastName.trim().length == 0) {
      errors.lastNameError = 'Last name cannot be empty';
    }
    if (this.state.address.trim().length == 0) {
      errors.addressError = 'Address cannot be empty';
    }
    if (this.state.city.trim().length == 0) {
      errors.cityError = 'City cannot be empty';
    }
    if (this.state.state.trim().length == 0) {
      errors.stateError = 'State cannot be empty';
    }
    if (this.state.phone.trim().length == 0) {
      errors.phoneError = 'Phone cannot be empty';
    } else if (this.containsSpecialChars(this.state.phone)) {
      errors.phoneError = 'Phone cannot contain Special Characters';
    }
    if (this.state.email.trim().length == 0) {
      errors.emailError = 'Email cannot be empty';
    }
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        this.state.email,
      )
    ) {
      errors.emailError = 'Not valid email';
    }
    if (Object.keys(errors).length) {
      this.setState({ ...errors });
      showToast('Please fill required fields');
      return false;
    }

    return true;
  };

  _placeOrder = async () => {
    if (!this.validateData()) {
      return;
    }
    // this.props.navigation.setParams({
    //   disableBack: true,
    // });
    this.setState({ loading: true });
    const shipping_lines = [];

    const {
      shipping: shippingTotal = 0,
      shippingOptions = [],
      localDelivery,
    } = this.getShippingDetails();

    if (shippingTotal || shippingOptions?.length) {
      if (!localDelivery && shippingOptions.length) {
        const shippingPrice =
          shippingOptions[this.state.selectedShippingOption]?.value || 0;
        shipping_lines.push({
          method_id: 'flat_rate',
          method_title:
            this.state.selectedShippingOption === 0
              ? 'Normal Delivery (2-5 working days)'
              : 'Urgent Delivery (1-2 working days)',
          total: `${shippingPrice.toFixed(2)}`,
        });
      } else {
        shipping_lines.push({
          method_id: 'flat_rate',
          method_title: 'Within Lahore',
          total: `${shippingTotal.toFixed(2)}`,
        });
      }
    }

    const couponData = this.props.navigation.getParam('couponData');

    let coupon_lines = [];
    if (
      couponData?.discount_amount &&
      couponData?.coupon_id &&
      couponData?.coupon_code
    ) {
      coupon_lines.push({
        code: couponData.coupon_code,
        discount: couponData.discount_amount,
      });
    }

    const customer_id = this.props.user.id;

    const billing = {
      customer_id,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address_1: this.state.address,
      city: this.state.city,
      state: this.state.state,
      email: this.state.email,
      phone: this.state.phone,
      additionalInformation: this.state.additionalInformation,
    };

    const shipping = {
      customer_id,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address_1: this.state.address,
      city: this.state.city,
      state: this.state.state,
    };

    const line_items = this.props.products.map(cartItem => ({
      quantity: cartItem.quantity,
      product_id: cartItem.id,
      meta_data: buildMetaData(cartItem),
    }));

    const orderData = {
      customer_id,
      order_number: Date(),
      payment_method: 'dos',
      billing: billing,
      shipping: shipping,
      set_paid: 'false',
      payment_method_title: 'Cash on delivery',
      status: 'processing',
      line_items,
      coupon_lines,
      shipping_lines,
    };

    try {
      const res = await Api.placeOrder(orderData);

      if (res.data.error) {
        return showToast(res.data.error);
      }

      showToast('Order placed successfully');
      this.setState({
        loading: false,
        orderReceipt: JSON.stringify(res.data.id),
        oderSuccess: true,
      });

      this.props.dispatch(clearCartProducts());
      if (res.data.status === 'processing') {
        res.data.status = 'received';
      }
      this.props.dispatch(addOrder(res.data));
      //this.props.navigation.dangerouslyGetParent().goBack();
    } catch (error) {
      console.log('Place order error: ', error);
      this.setState({ loading: false });
      showToast(
        error.message === 'Network Error'
          ? 'No Network Connection'
          : "Couldn't process the order",
      );
      // this.props.navigation.setParams({
      //   disableBack: false,
      // });
    }
  };

  onDeliveryPress = value => {};
  onShippingPress = (value, index) => {
    this.setState({ selectedShippingOption: index });
  };

  render() {
    if (this.state.oderSuccess) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ padding: 10, flex: 1, alignItems: 'center' }}>
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                borderRadius: 5,
                width: '100%',
                height: 250,
                paddingTop: 20,
                marginTop: 5,
                backgroundColor: '#fdf9c1',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                {`Thank you! Your order has been received. \n \n Your Order ID is #${this.state.orderReceipt}`}
              </Text>

              <View
                style={{
                  backgroundColor: primaryColor,
                  height: 120,
                  width: 120,
                  borderRadius: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/* <FontAwesome name="check" size={98} color="white" /> */}
                <Image
                  style={{
                    width: 98,
                    height: 98,
                  }}
                  resizeMode="cover"
                  resizeMethod="scale"
                  source={require('../../../assets/check.png')}
                />
              </View>
            </View>
            {/* this.props.navigation.dangerouslyGetParent().goBack() */}
            <TouchableOpacity
              onPress={() => {
                // this.props.navigation.setParams({
                //   disableBack: false,
                // });
                this.setState({ oderSuccess: false }, () => {
                  this.props.navigation.dispatch(resetAction);
                  this.props.navigation.navigate('Home');
                });
              }}
              style={{
                backgroundColor: primaryColor,
                justifyContent: 'center',
                width: wp('50%'),
                marginTop: 20,
                height: wp('12%'),
              }}>
              <Text style={[styles.placeOrderText, { textAlign: 'center' }]}>
                {'BACK TO HOME'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    const { shipping = 0, shippingOptions = [] } = this.getShippingDetails();

    return (
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.container}
          keyboardVerticalOffset={
            Platform.OS === 'ios'
              ? Header.HEIGHT + isIphoneX()
                ? hp(12)
                : hp(6)
              : 0
          }
          behavior={Platform.OS === 'ios' ? 'padding' : 'none'}
          keyboardShouldPersistTaps="handled">
          <View style={styles.flex}>
            <KeyboardAwareScrollView enableOnAndroid>
              <Text
                style={[styles.aggregateText, { margin: 15, marginBottom: 0 }]}>
                {'Enter Your Billing Details'}
              </Text>

              <View style={styles.nameContainer}>
                <View
                  style={{ flex: 0.48, zIndex: 1 }}
                  removeClippedSubviews={Platform.OS === 'ios' ? false : true}>
                  <TextField
                    label={'First Name'}
                    value={this.state.firstName}
                    error={this.state.firstNameError}
                    tintColor={primaryColor}
                    returnKeyType={'next'}
                    textContentType={'name'}
                    onChangeText={text =>
                      this.setState({ firstName: text, firstNameError: '' })
                    }
                    autoCorrect={false}
                    spellCheck={false}
                  />
                </View>

                <View
                  style={{ flex: 0.48, zIndex: 0 }}
                  removeClippedSubviews={Platform.OS === 'ios' ? false : true}>
                  <TextField
                    label={'Last Name'}
                    value={this.state.lastName}
                    error={this.state.lastNameError}
                    tintColor={primaryColor}
                    returnKeyType={'next'}
                    textContentType={'familyName'}
                    onChangeText={text =>
                      this.setState({ lastName: text, lastNameError: '' })
                    }
                    autoCorrect={false}
                    spellCheck={false}
                  />
                </View>
              </View>

              <View style={styles.valueContainer}>
                <TextField
                  label={'Billing address'}
                  value={this.state.address}
                  error={this.state.addressError}
                  tintColor={primaryColor}
                  returnKeyType={'next'}
                  textContentType={'fullStreetAddress'}
                  onChangeText={text =>
                    this.setState({ address: text, addressError: '' })
                  }
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>

              <View style={styles.addressContainer}>
                <View
                  style={{ flex: 0.48, zIndex: 1 }}
                  removeClippedSubviews={Platform.OS === 'ios' ? false : true}>
                  <TextField
                    label={'City'}
                    value={this.state.city}
                    error={this.state.cityError}
                    tintColor={primaryColor}
                    returnKeyType={'next'}
                    textContentType={'addressCity'}
                    onChangeText={(text = '') =>
                      this.setState({
                        city: text,
                        cityError: '',
                        selectedShippingOption:
                          text.toLowerCase() === 'lahore' &&
                          this.state.selectedShippingOption !== 0
                            ? 0
                            : this.state.selectedShippingOption,
                      })
                    }
                    autoCorrect={false}
                    spellCheck={false}
                  />
                </View>

                <View
                  style={{ flex: 0.48, zIndex: 0 }}
                  removeClippedSubviews={Platform.OS === 'ios' ? false : true}>
                  <TextField
                    label={'State'}
                    value={this.state.state}
                    error={this.state.stateError}
                    tintColor={primaryColor}
                    returnKeyType={'next'}
                    textContentType={'addressState'}
                    onChangeText={text =>
                      this.setState({ state: text, stateError: '' })
                    }
                    autoCorrect={false}
                    spellCheck={false}
                  />
                </View>
              </View>

              <View style={styles.valueContainer}>
                <TextField
                  label={'Email'}
                  keyboardType={'email-address'}
                  value={this.state.email}
                  error={this.state.emailError}
                  tintColor={primaryColor}
                  returnKeyType={'next'}
                  textContentType={'emailAddress'}
                  onChangeText={text =>
                    this.setState({ email: text, emailError: '' })
                  }
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>

              <View style={styles.valueContainer}>
                <TextField
                  label={'Phone Number'}
                  keyboardType={'phone-pad'}
                  value={this.state.phone}
                  error={this.state.phoneError}
                  tintColor={primaryColor}
                  returnKeyType={'next'}
                  textContentType={'telephoneNumber'}
                  onChangeText={text =>
                    this.setState({ phone: text, phoneError: '' })
                  }
                />
              </View>
              <View style={styles.valueContainer}>
                <TextField
                  label={'Additional Information'}
                  value={this.state.additionalInformation}
                  tintColor={primaryColor}
                  returnKeyType={'done'}
                  onChangeText={text =>
                    this.setState({ additionalInformation: text })
                  }
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>

              {!!shipping && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    paddingVertical: 0,
                    paddingHorizontal: 18,
                    marginTop: 15,
                  }}>
                  <Text style={styles.aggregateMediumText}>
                    {'Shippment Charges: '}
                  </Text>
                </View>
              )}

              {!!shippingOptions.length && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 15,
                    marginTop: 10,
                  }}>
                  <RadioForm
                    formHorizontal={false}
                    animation={true}
                    initial={0}>
                    {shippingOptions.map((obj, i) => (
                      <RadioButton labelHorizontal={true} key={i}>
                        <RadioButtonInput
                          obj={obj}
                          index={i}
                          isSelected={i === this.state.selectedShippingOption}
                          onPress={this.onShippingPress}
                          borderWidth={2}
                          buttonInnerColor={primaryColor}
                          buttonOuterColor={primaryColor}
                          buttonSize={10}
                          buttonOuterSize={20}
                          buttonStyle={{}}
                          buttonWrapStyle={{
                            marginLeft: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        />
                        <RadioButtonLabel
                          obj={obj}
                          index={i}
                          labelHorizontal={true}
                          onPress={this.onShippingPress}
                          labelStyle={{
                            ...styles.radioButtonLabelText,
                            marginStart: 5,
                          }}
                          labelWrapStyle={{
                            flexWrap: 'wrap',
                            flexShrink: 1,
                            paddingRight: 100,
                          }}
                        />
                      </RadioButton>
                    ))}
                  </RadioForm>
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  paddingVertical: 0,
                  paddingHorizontal: 18,
                  marginTop: 15,
                }}>
                <Text style={styles.aggregateMediumText}>
                  {'Payment Method: '}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 15,
                  marginTop: 10,
                }}>
                <RadioForm formHorizontal={true} animation={true} initial={0}>
                  {[{ label: 'COD (Cash on Delivery)', value: 0 }].map(
                    (obj, i) => (
                      <RadioButton labelHorizontal={true} key={i}>
                        <RadioButtonInput
                          obj={obj}
                          index={i}
                          isSelected={true}
                          onPress={this.onDeliveryPress}
                          borderWidth={2}
                          buttonInnerColor={primaryColor}
                          buttonOuterColor={primaryColor}
                          buttonSize={10}
                          buttonOuterSize={20}
                          buttonStyle={{}}
                          buttonWrapStyle={{ marginLeft: 10 }}
                        />
                        <RadioButtonLabel
                          obj={obj}
                          index={i}
                          labelHorizontal={true}
                          onPress={this.onDeliveryPress}
                          labelStyle={{
                            ...styles.radioButtonLabelText,
                            marginStart: 5,
                          }}
                          labelWrapStyle={{}}
                        />
                      </RadioButton>
                    ),
                  )}
                </RadioForm>
              </View>

              {/* <View style={[styles.valueContainer, { marginTop: 50 }]}>
              <Text
                style={{
                  textAlign: 'left',
                  marginBottom: hp('10%'),
                  color: '#000',
                }}>
                Note: For each order you place you will be charged with a
                certain shipment cost. You will be contacted for order
                confirmation and processing once you are done placing the order.
              </Text>
            </View> */}
            </KeyboardAwareScrollView>

            <Button
              title="PLACE AN ORDER NOW"
              loader={this.state.loading}
              onPress={() => this._placeOrder()}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    height: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  addressContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  valueContainer: {
    marginHorizontal: 15,
    alignSelf: 'stretch',
  },
  radioButtonLabelText: { fontSize: 16, fontWeight: '500', color: '#000' },
  aggregateText: { fontSize: 17, fontWeight: 'bold', color: primaryColor },
  aggregateMediumText: { fontSize: 16, fontWeight: '700', color: primaryColor },
  aggregateNormalText: { fontSize: 14, fontWeight: '600', color: primaryColor },
  placeOrderText: { fontSize: 14, color: '#fff', fontWeight: '700' },
});

const mapStateToProps = ({ user: { user }, cart: { products = [] } }) => {
  return {
    products,
    user,
  };
};

export default connect(mapStateToProps, null)(Checkout);
