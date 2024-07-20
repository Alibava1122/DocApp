import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';

import showToast from '../../utils/toast';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { Styles, HeaderTitle } from '../../components';
import { formatPrice } from '../../utils/utils';
import { primaryColor, primaryDarkColor } from '../../common/const';
import Card from './Components/Card';
import * as Api from '../../api/api';

class OrderReceipt extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={'Order Receipt'} />,
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
      headerTintColor: 'white',
    };
  };

  state = {
    order: undefined,
    inProgress: false,
  };

  constructor(props) {
    super(props);
    this.orderId = this.props.navigation.state.params.id;
  }

  componentDidMount() {
    this.getOrderDetails();
  }

  getOrderDetails = async () => {
    this.setState({ inProgress: true });
    try {
      const res = await Api.getOrderDetails(this.orderId);

      if (res.data.error) {
        showToast(res.data.error);
        return;
      }

      this.setState({
        order: res.data.order,
        inProgress: false,
      });
    } catch (error) {
      this.setState({ inProgress: false });
      showToast(
        error.message === 'Network Error'
          ? 'No Network Connection'
          : error.message,
      );
    }
  };

  _trackOrder = () => {
    if (this.orderId)
      this.props.navigation.navigate('OrderTrack', {
        status: this.state.order.status,
        id: this.orderId,
      });
  };

  getDiscount = () => {
    try {
      const { order = {} } = this.state;
      const { coupon_lines = [] } = order;
      return parseFloat(coupon_lines?.[0]?.amount || 0) || 0;
    } catch {
      return 0;
    }
  };

  getShippingAddress = () => {
    const { order } = this.state;

    if (order) {
      const {
        address_1 = '',
        address_2 = '',
        city = '',
      } = order.customer.shipping_address;

      return [[address_1, address_2].filter(Boolean).join(' ').trim(), city]
        .filter(Boolean)
        .join(', ');
    }

    return '';
  };

  render() {
    const { order } = this.state;
    const discount = this.getDiscount();
    const orderStatus =
      order?.status === 'processing' ? 'received' : order?.status;

    return (
      <SafeAreaView style={styles.safeViewcontainer}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={120}
          behavior="padding"
          style={styles.container}>
          <Spinner visible={this.state.inProgress} color={primaryColor} />
          <ScrollView keyboardShouldPersistTaps="always">
            <Card>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: primaryDarkColor,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  {'Status: '}
                  <Text
                    style={{
                      color: '#333',
                      fontSize: 15,
                      fontWeight: 'normal',
                      textTransform: 'capitalize',
                    }}>
                    {orderStatus}
                  </Text>
                </Text>
                <TouchableOpacity
                  onPress={this._trackOrder}
                  style={{
                    backgroundColor: primaryColor,
                    padding: 10,
                    paddingStart: 15,
                    paddingEnd: 15,
                  }}>
                  <Text style={Styles.buttonText}>{'TRACK ORDER'}</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <Card style={{ marginTop: 10 }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 5,
                  }}>
                  <Text
                    style={{
                      fontWeight: '500',
                      color: '#000000',
                      textAlign: 'center',
                    }}>
                    ITEM
                  </Text>
                  <Text
                    style={{
                      fontWeight: '500',
                      color: '#000000',
                      textAlign: 'center',
                    }}>
                    QTY
                  </Text>
                  <Text
                    style={{
                      fontWeight: '500',
                      color: '#000000',
                      textAlign: 'center',
                    }}>
                    PRICE
                  </Text>
                </View>

                {order &&
                  order.line_items.map(item => (
                    <View
                      key={item.id}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 5,
                      }}>
                      <Text style={{ flex: 0.339 }}>
                        {[
                          item.name,
                          ...(item.meta || item.meta_data || []).map(
                            ({ value }) => value,
                          ),
                        ].join(', ')}
                      </Text>
                      <Text
                        style={{
                          flex: 0.339,
                          textAlign: 'center',
                        }}>
                        {item.quantity}
                      </Text>
                      <Text style={{ flex: 0.339, textAlign: 'right' }}>
                        {formatPrice(parseInt(item.price))}
                      </Text>
                    </View>
                  ))}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                  }}>
                  <Text
                    style={{
                      fontWeight: '500',
                      color: '#000000',
                      textAlign: 'center',
                    }}>
                    Total
                  </Text>

                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#000000',
                      textAlign: 'center',
                    }}>
                    {!!order && `PKR ${formatPrice(parseInt(order.subtotal))}`}
                  </Text>
                </View>

                <View
                  style={{
                    height: 0.5,
                    backgroundColor: '#414141',
                    width: '100%',
                    margin: 10,
                    alignSelf: 'center',
                  }}
                />

                {!!discount && (
                  <View
                    style={{
                      justifyContent: 'space-between',
                      width: '50%',
                      alignSelf: 'flex-end',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        textAlign: 'right',
                        color: '#000000',
                        fontSize: 15,
                      }}>
                      Discount
                    </Text>
                    <Text style={{ color: '#000000', fontSize: 15 }}>
                      {!!order && `PKR ${discount}`}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    justifyContent: 'space-between',
                    width: '50%',
                    alignSelf: 'flex-end',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      textAlign: 'right',
                      color: '#000000',
                      fontSize: 15,
                    }}>
                    Shipping
                  </Text>
                  <Text style={{ color: '#000000', fontSize: 15 }}>
                    {!!order && `PKR ${parseInt(order.total_shipping)}`}
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: 'flex-end',
                    marginTop: 10,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      flex: 0.5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: primaryColor,
                      marginBottom: 10,
                    }}>
                    <Text style={{ color: '#fff' }}>{'Order Total'}</Text>
                    <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                      {!!order &&
                        `PKR ${formatPrice(parseInt(order.total) - discount)}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#000000',
                margin: 15,
                marginBottom: 5,
              }}>
              {'Order Details'}
            </Text>

            <Card>
              <View>
                <Text style={styles.detailsHeader}>Contact Information</Text>
                <Text style={styles.infoText}>
                  {order &&
                    `${order.customer.first_name} ${order.customer.last_name}`}
                </Text>
                <Text style={styles.infoText}>
                  {order && order.customer.billing_address.phone}
                </Text>
                <Text style={styles.detailsHeader}>Shipping Address</Text>
                <Text style={styles.infoText}>
                  {order && this.getShippingAddress()}
                </Text>
                <Text style={[styles.detailsHeader, { marginTop: 10 }]}>
                  {'Date & Time'}
                </Text>
                <Text style={styles.infoText}>
                  {order &&
                    moment(order.created_at).format('DD-MM-YYYY HH:mm:ss')}
                </Text>
              </View>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#eee',
  },
  safeViewcontainer: {
    flex: 1,
    backgroundColor: '#eee',
  },
  detailsHeader: {
    color: primaryDarkColor,
    marginTop: 5,
    fontSize: 15,
  },
  infoText: {
    color: '#000000',
    marginTop: 5,
    fontSize: 15,
  },
});

const mapStateToProps = ({ user: { user } }) => {
  return {
    user,
  };
};

export default connect(mapStateToProps, null)(OrderReceipt);
