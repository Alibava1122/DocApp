//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { updateOrder } from '../../api/api';
import showToast from '../../utils/toast';

import moment from 'moment';

import { HeaderTitle } from '../../components';
import { primaryColor, primaryDarkColor } from '../../common/const';
import Card from './Components/Card';

class OrderTrack extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={'Order Tracking'} />,
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
      headerTintColor: 'white',
    };
  };

  state = {
    eventDate: moment
      .duration()
      .add({ days: 7, hours: 0, minutes: 0, seconds: 0 }), // add 9 full days, 3 hours, 40 minutes and 50 seconds
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  };

  constructor(props) {
    super(props);

    const {
      navigation: {
        state: {
          params: { id, status },
        },
      },
    } = this.props;
    // console.log(this.props.navigation.state.params);
    this.orderId = id;
    this.orderStatus = status === 'processing' ? 'received' : status;
  }

  componentDidMount() {
    this.updateTimer();
  }

  updateTimer = () => {
    const x = setInterval(() => {
      let { eventDate } = this.state;

      if (eventDate <= 0) {
        clearInterval(x);
      } else {
        eventDate = eventDate.subtract(1, 's');
        const days = eventDate.days();
        const hours = eventDate.hours();
        const mins = eventDate.minutes();
        const secs = eventDate.seconds();

        this.setState({
          days,
          hours,
          mins,
          secs,
          eventDate,
          loading: false,
        });
      }
    }, 1000);
  };

  _confirmDelivery = async () => {
    this.setState({ loading: true });
    // console.log('confirm delivery');

    try {
      const res = await updateOrder(this.orderId);
      console.log(res);

      if (res.data.error) {
        showToast(res.data.error);
        return;
      }
      showToast('Order updated successfully!');
      setTimeout(() => {
        this.props.navigation.pop(2);
      }, 500);

      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
      showToast(
        error.message === 'Network Error'
          ? 'No Network Connection'
          : error.message,
      );
    }
  };

  getOrderInfoTitle = () => {
    switch (this.orderStatus) {
      case 'pending': {
        return 'Your order will be delivered in';
      }
      default: {
        return 'Your order status information';
      }
    }
  };
  getOrderInfoDesc = () => {
    const { days, hours, mins, secs } = this.state;
    switch (this.orderStatus?.toLowerCase()) {
      case 'received': {
        return 'Thank you! Your order has been received.';
      }
      case 'pending': {
        return `${days} : ${hours} : ${mins} : ${secs}`;
      }
      case 'shipped': {
        return `Your order has been shipped. You should receive your order shortly.`;
      }
      case 'cancelled': {
        return `Your order has been cancelled for some reason. You can try to place the order again or you can try to contact the administrator if you have more questions regarding why this order was cancelled.`;
      }
      case 'completed': {
        return `Congratulations ! This means that you have received your order. Thank you for your purchase. We really appreciate it.`;
      }
      case 'processing': {
        return `We are processing your order.`;
      }
      case 'failed': {
        return `For some reason we failed to process your order.`;
      }
      case 'refunded': {
        return `Your order has been refunded.`;
      }
      case 'on hold': {
        return `Your order has been put on hold for some reason. Please wait. Hopefully someone will try to contact you regarding this.`;
      }
      case 'on-hold': {
        return `Your order has been put on hold for some reason. Please wait. Hopefully someone will try to contact you regarding this.`;
      }
      case 'on_hold': {
        return `Your order has been put on hold for some reason. Please wait. Hopefully someone will try to contact you regarding this.`;
      }
      case 'hold': {
        return `Your order has been put on hold for some reason. Please wait. Hopefully someone will try to contact you regarding this.`;
      }
      case 'onhold': {
        return `Your order has been put on hold for some reason. Please wait. Hopefully someone will try to contact you regarding this.`;
      }
      default: {
        return '';
      }
    }
  };

  render() {
    const orderStatus = this.orderStatus || '';

    const orderInfoTitle = this.getOrderInfoTitle();
    const orderInfoDescription = this.getOrderInfoDesc();

    return (
      <SafeAreaView style={styles.container}>
        <Card style={{ marginTop: 20, padding: 15, paddingTop: 0 }}>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{ color: primaryDarkColor, fontSize: 16, marginTop: 5 }}>
              Status
            </Text>
            <Text
              style={{
                color: '#888',
                marginTop: 10,
                marginBottom: 5,
                textTransform: 'capitalize',
              }}>
              {orderStatus}
            </Text>
          </View>
        </Card>

        <Card style={{ marginTop: 25, padding: 15, paddingTop: 0 }}>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{ color: primaryDarkColor, fontSize: 15, marginTop: 10 }}>
              {orderInfoTitle}
            </Text>
            <Text style={{ marginTop: 10, marginBottom: 5 }}>
              {orderInfoDescription}
            </Text>
          </View>
        </Card>
        {/* {!this.state.loading ? (
          <TouchableOpacity
            onPress={this._confirmDelivery}
            style={{
              backgroundColor: primaryColor,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 45,
              width: '80%',
              alignSelf: 'center',
            }}>
            <Text style={Styles.buttonText}>CONFIRM DELIVERY</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              backgroundColor: primaryColor,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 45,
              width: '80%',
              alignSelf: 'center',
            }}>
            <ActivityIndicator color="white" />
          </View>
        )} */}

        <View style={{ marginVertical: 38, marginHorizontal: 20 }}>
          <Text style={{ color: '#aaaaaa', fontSize: 14 }}>
            {
              'Note: For each order you place you will be charged with a certain shipment cost. You will be contacted for order confirmation and processing once you are done placing the order.'
            }
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fafafa',
  },
});

export default OrderTrack;
