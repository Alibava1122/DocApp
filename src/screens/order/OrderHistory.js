import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import * as Api from '../../api/api';
import { Styles, EmptyView, HeaderTitle } from '../../components';
import { formatPrice } from '../../utils/utils';
import showToast from '../../utils/toast';
import { primaryColor } from '../../common/const';

class OrderHistory extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={'Order History'} />,
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
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
    items: [],
    inProgress: false,
  };

  componentDidMount() {
    this.props.navigation.addListener('didFocus', payload => {
      this.getData();
    });
  }

  getData = async () => {
    const { user = {}, orders = [] } = this.props;

    if (!user.id) {
      // console.log('GET DATA FROM CACHE: ', orders);
      return this.setState({
        items: orders,
        inProgress: false,
      });
    }

    if (!this.state?.items?.length) {
      this.setState({
        inProgress: true,
      });
    }

    try {
      const res = await Api.getOrders(user.id);
      // console.log(res);

      if (res.data.error) {
        this.setState({
          inProgress: false,
        });
        showToast(res.data.error);
        return;
      }

      this.setState({
        items: res.data,
        inProgress: false,
      });
    } catch (error) {
      // console.log(error);
      showToast(
        error.message === 'Network Error'
          ? 'No Network Connection'
          : error.message,
      );
      this.setState({
        inProgress: false,
      });
    }
  };

  _onItemPress = item => {
    // console.log(item);
    this.props.navigation.navigate('OrderReceipt', { id: item.id + '' });
  };

  _renderItem = item => {
    return (
      <TouchableOpacity
        onPress={() => this._onItemPress(item)}
        style={[styles.itemContainer, Styles.viewShadow]}>
        <Image
          resizeMode="contain"
          style={styles.itemImage}
          source={require('../../../assets/order.png')}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            marginStart: 15,
            paddingVertical: 16,
          }}>
          <Text style={{ color: primaryColor, fontSize: 15 }}>
            Order ID:{' '}
            <Text style={{ color: '#000', fontWeight: 'bold' }}>{item.id}</Text>
          </Text>
          <Text style={{ fontWeight: 'bold', color: '#323232', fontSize: 15 }}>
            {item.currency} {formatPrice(item.total)}
          </Text>
        </View>
        <View style={styles.quantityContainer}>
          <Text
            style={{ color: primaryColor, fontSize: 15, fontWeight: '500' }}>
            QTY:{' '}
            <Text style={{ color: '#000', fontWeight: 'bold' }}>
              {item.line_items.length}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { inProgress, items = [] } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View>
          {inProgress ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={primaryColor} />
            </View>
          ) : null}
        </View>

        {!inProgress && !!items.length && (
          <FlatList
            data={items}
            keyExtractor={item => item.id + ''}
            renderItem={({ item }) => this._renderItem(item)}
            ListFooterComponent={() => <View style={{ height: 70 }} />}
          />
        )}
        {!inProgress && !items.length && (
          <EmptyView placeholder={'You have placed no orders yet'} />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },

  itemImage: { width: 40, height: 40, marginStart: 15, alignSelf: 'center' },

  quantityContainer: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginEnd: 5,
    paddingBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    flex: 1,
    height: 80,
    paddingEnd: 30,
    paddingStart: 10,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 8,
    alignSelf: 'stretch',
  },
});

const mapStateToProps = ({ user: { user }, orders: { orders = [] } }) => {
  return {
    orders,
    user,
  };
};

export default connect(mapStateToProps, null)(OrderHistory);
