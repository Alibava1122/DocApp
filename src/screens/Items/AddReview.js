import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { addReview } from '../../api/api';
import { AirbnbRating } from 'react-native-ratings';
import showToast from '../../utils/toast';
import { Styles } from '../../components/Styles';

import { primaryColor } from '../../common/const';

class AddReview extends Component {
  state = {
    rating: 0,
    name: '',
    reviews: '',
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
      headerRight: () => <View></View>,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
    };
  };

  ratingCompleted = rating => {
    this.setState({ rating: rating });
  };
  _addReview = async () => {
    this.setState({ loading: true });
    const reviewData = {
      name: this.state.name,
      review: this.state.reviews,
      rating: this.state.rating,
      email: 'emai@email.com',
    };

    const data = JSON.stringify(reviewData);

    console.log(
      'Order dataa ' + data + 'IDDDDDD ' + this.props.navigation.getParam('id'),
    );
    try {
      const res = await addReview(this.props.navigation.getParam('id'), data);

      if (res.data.error) {
        showToast(res.data.error);
      }
      this.setState({ loading: false });

      showToast('Review added successfully');
    } catch (error) {
      this.setState({ loading: false });
      console.log('ERRORR ' + error);
      showToast(
        error.message === 'Network Error'
          ? 'No Network Connection'
          : "Couldn't add the review",
      );
    }
  };

  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, alignSelf: 'stretch', backgroundColor: '#f1f1f1' }}>
        <View style={styles.container}>
          <View
            style={[
              {
                width: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                height: 100,
                marginTop: 15,
                borderRadius: 5,
              },
              Styles.viewShadow,
            ]}>
            <Text style={{ marginBottom: 8, fontWeight: '500', fontSize: 15 }}>
              {'SHARE YOUR OPINION WITH US'}
            </Text>
            <AirbnbRating
              showRating={false}
              size={30}
              defaultRating={5}
              onFinishRating={this.ratingCompleted}
            />
          </View>

          <View style={[{ marginTop: 15, width: '90%' }, Styles.viewShadow]}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{'Name'}</Text>
            <TextInput
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 8,
                fontSize: 16,
                marginTop: 5,
                backgroundColor: 'white',
                height: 50,
                borderRadius: 5,
              }}
              value={this.state.name}
              onChangeText={text => this.setState({ name: text })}
            />
          </View>

          <View style={[{ marginTop: 15, width: '90%' }, Styles.viewShadow]}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
              {'Reviews'}
            </Text>
            <TextInput
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                textAlignVertical: 'top',
                paddingLeft: 8,
                paddingTop: 10,
                fontSize: 16,
                marginTop: 5,
                height: 150,
                borderRadius: 5,
              }}
              value={this.state.reviews}
              onChangeText={text => this.setState({ reviews: text })}
            />
          </View>

          {!this.state.loading ? (
            <TouchableOpacity
              onPress={() => this._addReview()}
              style={styles.placeOrderButton}>
              <Text style={styles.placeOrderText}>SUBMIT</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => console.log('Clicked order')}
              style={styles.placeOrderButton}>
              <ActivityIndicator color="white" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  ratingStyle: {
    marginTop: 10,
    marginBottom: 5,
  },
  placeOrderButton: {
    backgroundColor: primaryColor,
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 2,
    //width: wp('100%'),
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderText: { fontSize: 14, color: '#fff', fontWeight: '700' },
});

export default AddReview;
