//import liraries
import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { getReviews } from '../../api/api';
import { Rating } from 'react-native-ratings';
import { EmptyView, ScreenLoader } from '../../components';

import { primaryColor } from '../../common/const';

class Reviews extends Component {
  state = {
    reviews: [],
    loading: false,
  };
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <Text
            style={{
              fontSize: 22,
              color: '#fff',
            }}>
            {navigation.getParam('name', 'Product Name')}
          </Text>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddReview', {
              id: navigation.getParam('id'),
              name: navigation.getParam('name', 'Product Name'),
            })
          }>
          <Image
            resizeMode="contain"
            resizeMethod="scale"
            source={require('../../../assets/plus.png')}
            style={{
              width: 22,
              height: 22,
              marginRight: 10,
              tintColor: 'white',
            }}
          />
        </TouchableOpacity>
      ),
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
    };
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({ loading: true });
    const res = await getReviews(this.props.navigation.getParam('id'));
    this.setState({ reviews: res.data.product_reviews, loading: false });
  };

  _renderItem = ({ item }) => {
    return (
      <View
        style={{
          height: 70,
          margin: 15,
          marginVertical: 8,
          borderBottomWidth: 0.5,
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{ fontWeight: 'bold' }}>{item.reviewer_name}</Text>
          <Rating
            readonly
            fractions={5}
            imageSize={25}
            startingValue={item.rating}
            style={styles.ratingStyle}
          />
        </View>
        <Text numberOfLines={1}>{item.review}</Text>
      </View>
    );
  };

  render() {
    const { loading, reviews } = this.state;
    return (
      <View style={styles.container}>
        {!!loading && <ScreenLoader />}
        {!loading && !!reviews.length && (
          <FlatList
            data={reviews}
            keyExtractor={item => item}
            renderItem={this._renderItem}
          />
        )}
        {!loading && !reviews.length && (
          <EmptyView placeholder={'There is no review about this product'} />
        )}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ratingStyle: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 5,
  },
});

export default Reviews;
