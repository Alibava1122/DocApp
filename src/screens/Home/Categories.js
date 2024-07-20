import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';

class Categories extends Component {
  state = {
    animatedValue: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.timing(this.state.animatedValue, {
      toValue: 1,
      duration: 900,
      delay: 20,
      easing: Easing.elastic(0.9),
      useNativeDriver: true,
    }).start();
  }

  onItemPress = (page) => {
    this.props.navigation.navigate('ProductList', { type: page });
  };

  render() {
    let { animatedValue } = this.state;
    return (
      <Animated.View
        style={{
          marginTop: 10,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-(Dimensions.get('screen').width * 0.85), 0],
              }),
            },
          ],
        }}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => this.onItemPress('Orthodontics')}
            style={styles.imageContainer}>
            <Image
              fadeDuration={0}
              style={styles.imageStyle}
              resizeMode="contain"
              source={require('../../../assets/orthodontics.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.onItemPress('Equipments')}
            style={styles.imageContainer}>
            <Image
              fadeDuration={0}
              style={styles.imageStyle}
              resizeMode="contain"
              source={require('../../../assets/equipments.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => this.onItemPress('Oral-surgery')}
            style={styles.imageContainer}>
            <Image
              fadeDuration={0}
              style={styles.imageStyle}
              resizeMode="contain"
              source={require('../../../assets/oralsyrgery.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.onItemPress('Disposables')}
            style={styles.imageContainer}>
            <Image
              fadeDuration={0}
              style={styles.imageStyle}
              resizeMode="contain"
              source={require('../../../assets/disposables.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => this.onItemPress('Periodontics')}
            style={styles.imageContainer}>
            <Image
              fadeDuration={0}
              style={styles.imageStyle}
              resizeMode="contain"
              source={require('../../../assets/periodontics.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.onItemPress('Prosthodontics')}
            style={styles.imageContainer}>
            <Image
              fadeDuration={0}
              style={styles.imageStyle}
              resizeMode="contain"
              source={require('../../../assets/prosthodonics.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => this.onItemPress('Restoration')}
            style={styles.imageContainer}>
            <Image
              fadeDuration={0}
              style={styles.imageStyle}
              resizeMode="contain"
              source={require('../../../assets/restoration.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.onItemPress('Others')}
            style={styles.imageContainer}>
            <Image
              fadeDuration={0}
              style={styles.imageStyle}
              resizeMode="contain"
              source={require('../../../assets/others.png')}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
}

const styles = EStyleSheet.create({
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '46%',
    height: '100%',
  },

  row: {
    flexDirection: 'row',
    width: '70%',
    height: 120,
    marginTop: 10,
    justifyContent: 'space-around',
  },
});

export default withNavigation(Categories);
