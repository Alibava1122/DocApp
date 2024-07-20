import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Button, Styles, HeaderTitle, EditButton } from '../../components';
import CouponInput from './Components/CouponInput';
import { formatPrice } from '../../utils/utils';
import { primaryColor } from '../../common/const';

const ProductItemView = ({ item }) => (
  <View style={styles.itemContainer}>
    <Text
      style={[
        {
          flex: 0.55,
          flexDirection: 'row',
          textAlign: 'center',
        },
        Styles.normalText,
      ]}>
      {[
        item.title,
        item?.options?.type,
        item?.options?.color,
        item?.options?.size,
      ]
        .filter(Boolean)
        .join(', ')}
    </Text>

    <Text
      style={[
        { flex: 0.15, textAlign: 'center' },
        Styles.normalText,
      ]}>{`x${item.quantity}`}</Text>

    <Text style={[{ flex: 0.3, textAlign: 'center' }, Styles.normalText]}>
      {`PKR ${formatPrice(Math.round(Number(item.price)))}`}
    </Text>
  </View>
);

class OrderSummary extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle />,
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
    };
  };

  state = {
    couponData: undefined,
  };

  goToCheckoutPage = async () => {
    const { couponData } = this.state;
    this.props.navigation.navigate('Checkout', { couponData });
  };

  goBack = async () => {
    this.props.navigation.pop();
  };

  getTotalInfo = () => {
    const { couponData } = this.state;
    const { products } = this.props;
    const info = products.reduce(
      (result, item) => {
        result.fullPrice += Number(item.price) * Number(item.quantity);
        result.totalPrice = result.fullPrice;
        result.totalItems += item.quantity;
        return result;
      },
      {
        fullPrice: 0,
        totalPrice: 0,
        totalItems: 0,
      },
    );

    if (couponData?.discount_amount) {
      info.totalPrice -= couponData?.discount_amount;
      info.couponDiscount = couponData?.discount_amount;
    }

    return info;
  };

  onCouponApplied = couponData => {
    this.setState({ couponData });
  };

  render() {
    const { products } = this.props;
    const { fullPrice, totalPrice, totalItems, couponDiscount } =
      this.getTotalInfo();

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            extraScrollHeight={150}
            style={{
              paddingTop: 5,
              paddingHorizontal: 15,
            }}
            contentContainerStyle={{ flex: 1, alignSelf: 'stretch' }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                marginBottom: 30,
                justifyContent: 'center',
              }}>
              <Text style={Styles.subTitle}>{'Order Summary'}</Text>

              <EditButton onPress={this.goBack} />
            </View>

            {products.map(item => (
              <ProductItemView key={item.id} item={item} />
            ))}

            <View style={[styles.aggregateBreaker, { marginTop: 15 }]} />
            <View style={styles.aggregateContainer}>
              <Text style={styles.aggregateText}>Items: {totalItems}</Text>
              <Text
                style={[
                  styles.aggregateText,
                  { marginLeft: 'auto' },
                ]}>{`PKR ${formatPrice(fullPrice)}`}</Text>
            </View>
            <View style={styles.aggregateBreaker} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingVertical: 15,
                paddingHorizontal: 28,
              }}>
              {!!couponDiscount && (
                <Text
                  style={[
                    styles.aggregateText,
                    { marginRight: 'auto' },
                  ]}>{`Coupon PKR ${formatPrice(couponDiscount)}`}</Text>
              )}
              <Text style={styles.aggregateText}>{`PKR ${formatPrice(
                totalPrice,
              )}`}</Text>
            </View>

            <CouponInput onCouponApplied={this.onCouponApplied} />
          </KeyboardAwareScrollView>

          <Button title={'NEXT'} onPress={this.goToCheckoutPage} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 25,
  },
  itemContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '95%',
    minHeight: 25,
    alignItems: 'flex-start',
  },
  aggregateContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 10,
    paddingStart: 0,
    paddingEnd: 0,
    width: '85%',
  },
  aggregateText: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
  },
  aggregateBreaker: {
    width: '95%',
    height: 2,
    backgroundColor: primaryColor,
    alignSelf: 'center',
  },
});

const mapStateToProps = ({ cart: { products = [] } }) => {
  return {
    products,
  };
};

export default connect(mapStateToProps, null)(OrderSummary);
