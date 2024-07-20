//import liraries
import React, { useCallback, useRef, memo } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  Button,
  Platform,
} from 'react-native';
// import FastImage from 'react-native-fast-image';
import SendIntentAndroid from 'react-native-send-intent';
import { Viewport } from '@skele/components';
import { Styles } from '../../components/Styles';
import { formatPrice } from '../../utils/utils';
import { primaryColor } from '../../common/const';
import { CartButton, SmartImage, ScreenLoader } from '../../components';
import { loadCategory } from '../../redux/categories/actions';
import { prefetch } from '../../utils/imageCache';

const ViewportAwareView = Viewport.Aware(Animated.View);

const screenWidth = Dimensions.get('screen').width;

const ItemComponent = memo(({ item, onItemPress }) => {
  const img = item?.scaled_image || item.images?.[0]?.src || '';
  const slideAnim = useRef(new Animated.Value(item?.animated ? 1 : 0)).current;
  const startAnimation = useCallback(() => {
    if (!item?.animated) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 750,
        // delay: 10,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }).start();
      item.animated = true;
    }
  }, [item?.id]);

  return (
    <ViewportAwareView
      preTriggerRatio={0.8}
      onViewportEnter={startAnimation}
      // onViewportLeave={this.stopAnimation}
      style={{
        width: '50%',
        // aspectRatio: 1,
        height: 205,
        transform: [
          {
            translateX: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-screenWidth, 0],
            }),
          },
        ],
      }}>
      <TouchableOpacity
        onPress={onItemPress}
        style={[styles.itemContainer, Styles.viewShadow, { elevation: 2 }]}>
        <View style={{ padding: 5, paddingTop: 3 }}>
          <SmartImage
            uri={img}
            style={{
              width: '100%',
              height: 123,
              alignSelf: 'center',
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              lineHeight: 17,
              paddingLeft: 8,
              paddingTop: 2,
              paddingRight: 5,
              color: '#000000',
            }}
            numberOfLines={2}>
            {item.title}
          </Text>
          <Text
            style={{
              color: primaryColor,
              fontSize: 13,
              fontWeight: 'bold',
              paddingLeft: 8,
              marginBottom: 7,
              marginTop: 'auto',
            }}>
            {`PKR ${formatPrice(Math.round(item.price))}`}
          </Text>
        </View>
      </TouchableOpacity>
    </ViewportAwareView>
  );
});

class ItemList extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: () => (
        <View>
          <Text
            style={{
              fontSize: 22,
              color: '#fff',
            }}>
            {'E-Dental Mart'}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#fff',
            }}>
            {navigation.state.params.type}
          </Text>
        </View>
      ),
      headerRight: () => <CartButton />,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 80,
      },
    };
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.props.dispatch(loadCategory(this.props.navigation.state.params.type));
  };

  onItemPress = item => {
    if (item?.images?.length) {
      // const preloadLinks = item?.images
      //   ?.filter((img, index) => !!index && !!img.src)
      //   .map((img) => ({ uri: img.src }));
      // FastImage.preload(preloadLinks);

      prefetch(item?.images?.filter(img => !!img.src).map(img => img.src));
    }
    this.props.navigation.navigate('ProductDetails', { id: item.id, item });
  };

  _renderItem = ({ item }) => {
    return (
      <ItemComponent
        key={item.id}
        item={item}
        onItemPress={() => this.onItemPress(item)}
      />
    );
  };

  render() {
    const { loading, noInternet, items } = this.props;

    if (noInternet) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            alignSelf: 'stretch',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#eaeaea',
          }}>
          <Text
            style={{
              color: '#7E7E7E',
              fontSize: 18,
              marginHorizontal: 30,
              marginVertical: 10,
              textAlign: 'center',
            }}>
            {Platform.select({
              ios: 'No Internet connection. Please make sure that Wi-Fi or Mobile Data is turned on, then try again.',
              android: (
                <>
                  {'No Internet connection. Please make sure that '}
                  <Text
                    style={{
                      color: '#00594B',
                      textDecorationLine: 'underline',
                    }}
                    onPress={() => {
                      SendIntentAndroid.openSettings(
                        'android.settings.WIFI_SETTINGS',
                      );
                    }}>
                    {'Wi-Fi'}
                  </Text>
                  {' or '}
                  <Text
                    style={{
                      color: '#00594B',
                      textDecorationLine: 'underline',
                    }}
                    onPress={() => {
                      SendIntentAndroid.openSettings(
                        'android.settings.DATA_USAGE_SETTINGS',
                      );
                    }}>
                    {'Mobile Data'}
                  </Text>
                  {' is turned on, then try again.'}
                </>
              ),
            })}
          </Text>
          <Button
            title={'Retry'}
            color={primaryColor}
            onPress={this.getData}></Button>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { paddingTop: 15 }]}>
          {loading && <ScreenLoader />}

          {!!items?.length && (
            <Viewport.Tracker>
              <FlatList
                data={items}
                keyExtractor={item => item.id + ''}
                renderItem={this._renderItem}
                numColumns={2}
                // maxToRenderPerBatch={10}
                // updateCellsBatchingPeriod={1}
                // removeClippedSubviews={true}
                initialNumToRender={6}
                // decelerationRate={'fast'}
                // showsVerticalScrollIndicator={false}
                windowSize={4}
              />
            </Viewport.Tracker>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    alignSelf: 'stretch',
  },
  itemContainer: {
    width: '93%',
    backgroundColor: '#fff',
    borderRadius: 2,
    height: '94%',
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
});

const mapStateToProps = ({ categories }, { navigation }) => {
  const categoryModel = categories[navigation.state.params.type];
  return {
    loading: categoryModel?.loading,
    noInternet: categoryModel?.noInternet,
    items: categoryModel?.items,
  };
};

export default connect(mapStateToProps)(ItemList);
