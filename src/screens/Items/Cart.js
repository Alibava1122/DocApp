//import liraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  incCartProducts,
  decCartProducts,
  removeCartProducts,
} from '../../redux/cart/actions';
import {
  Button,
  Stepper,
  EmptyView,
  Styles,
  SmartImage,
} from '../../components';
import { formatPrice } from '../../utils/utils';
import { primaryColor } from '../../common/const';

class Cart extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (
        <Text
          style={{
            fontSize: 22,
            marginStart: 10,
            color: '#fff',
          }}>
          {'My Cart'}
        </Text>
      ),
      drawerLabel: 'My Cart',
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
      headerLeft: () => (
        //navigation.openDrawer()
        <TouchableOpacity
          onPress={() =>
            navigation.isFirstRouteInParent()
              ? navigation.navigate('Home')
              : navigation.pop()
          }>
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

  _removeItem = async id => {
    this.props.dispatch(removeCartProducts({ id }));
  };

  _incrementItem = async id => {
    this.props.dispatch(incCartProducts({ id }));
  };

  _decrementItem = async id => {
    this.props.dispatch(decCartProducts({ id }));
  };

  _renderItem = item => {
    if (!item) {
      return null;
    }
    const img = item?.scaled_image || item?.images?.[0]?.src;
    const title = [
      item.title,
      item?.options?.type,
      item?.options?.color,
      item?.options?.size,
    ]
      .filter(Boolean)
      .join(', ');
    return (
      <View style={[styles.itemContainer, Styles.viewShadow, { elevation: 8 }]}>
        <View
          style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
          <Text
            style={{
              color: primaryColor,
              fontSize: 18,
              fontWeight: 'bold',
              marginRight: 30,
            }}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {title}
          </Text>

          <TouchableOpacity
            style={{
              marginLeft: 'auto',
              width: 25,
              height: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => this._removeItem(item.id)}>
            <Image
              style={{
                width: 25,
                height: 25,
              }}
              resizeMode="contain"
              resizeMethod="scale"
              source={require('../../../assets/deletebutton.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flex: 1, marginTop: 5 }}>
          <SmartImage
            resizeMode="cover"
            style={{ width: 50, height: 50 }}
            uri={img}
          />
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Stepper
              title={item.quantity}
              onMinus={() => this._decrementItem(item.id)}
              onPlus={() => this._incrementItem(item.id)}
            />
          </View>
          <View
            style={{
              marginLeft: 'auto',
              marginTop: 5,
            }}>
            <Text style={styles.priceTitle} numberOfLines={2}>
              {`PKR ${formatPrice(Math.round(item.price * item.quantity))}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  goToOrderSummary = () => {
    this.props.navigation.navigate('OrderSummary');
  };

  goBack = () => {
    this.props.navigation.pop();
  };

  render() {
    const { products = [] } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {!!products?.length && (
            <View style={styles.container}>
              <FlatList
                data={products}
                keyExtractor={item => item.id + ''}
                renderItem={({ item }) => this._renderItem(item)}
                ListFooterComponent={() => <View style={{ height: 70 }} />}
              />
              <Button title={'CONTINUE SHOPPING'} onPress={this.goBack} />
              <Button title={'CHECKOUT'} onPress={this.goToOrderSummary} />
            </View>
          )}
          {!products?.length && <EmptyView placeholder={'Cart is empty'} />}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: '#fff',
  },

  counterActionStyle: {
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
  },

  changeItemCount: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    padding: 2,
    marginStart: 1,
    marginEnd: 1,
    minWidth: 50,
    textAlignVertical: 'center',
    backgroundColor: primaryColor,
  },

  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    minHeight: 90,
    // maxHeight: 160,
    padding: 10,
    backgroundColor: '#fff',
    elevation: 1.5,
    margin: 5,
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
  },
  priceTitle: {
    fontSize: 14,
    color: primaryColor,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

const mapStateToProps = ({ user: { user }, cart: { products = [] } }) => {
  return {
    user,
    products,
  };
};

export default connect(mapStateToProps, null)(Cart);
