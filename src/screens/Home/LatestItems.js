import React, { useEffect, useCallback, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
// import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import { loadLatestProducts } from '../../redux/home/actions';
import { Styles, SmartImage } from '../../components';
import { formatPrice } from '../../utils/utils';
import { prefetch } from '../../utils/imageCache';
import { primaryColor } from '../../common/const';

const Item = memo(({ item, onPress = function (id, item) {} }) => {
  const uri = item?.scaled_image || item?.images?.[0]?.src;

  return (
    <View
      style={{
        // marginVertical: 5,
        padding: 5,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={[
          {
            width: 192,
            ...Platform.select({
              ios: {
                height: 206,
              },
              android: {},
            }),
            backgroundColor: 'white',
            borderRadius: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          Styles.viewShadow,
        ]}
        onPress={() => onPress(item?.id, item)}>
        <View style={{ paddingTop: 3 }}>
          <SmartImage
            resizeMode="cover"
            style={{ width: 182, height: 120 }}
            uri={uri}
          />
        </View>
        <Text
          style={{
            alignSelf: 'flex-start',
            marginLeft: 8,
            marginRight: 5,
            marginTop: 7,
            fontSize: 15,
            color: 'black',
          }}
          numberOfLines={2}
          ellipsizeMode="tail">
          {`${item?.title}\n`}
        </Text>
        <Text
          style={{
            alignSelf: 'flex-start',
            marginLeft: 8,
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 'bold',
            color: primaryColor,
          }}>
          {`PKR ${formatPrice(Math.round(item?.price))}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const LatestItems = memo(
  ({ dispatch, navigation, products = [], loading, isRehydrated }) => {
    useEffect(() => {
      if (isRehydrated) {
        dispatch(loadLatestProducts());
      }
    }, [isRehydrated]);

    const onPress = useCallback((id, item) => {
      if (item?.images?.length) {
        // const preloadLinks = item?.images
        //   ?.filter((img, index) => !!index && !!img.src)
        //   .map((img) => ({ uri: img.src }));
        prefetch(
          item?.images?.filter((img) => !!img.src).map((img) => img.src),
        );
      }
      navigation.navigate('ProductDetails', { id, item });
    }, []);

    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 15,
          marginBottom: 5,
          backgroundColor: '#eee',
        }}>
        <Text style={{ fontSize: 25, color: '#6d6d6d' }}>
          {'Latest Products'}
        </Text>
        {!!loading && !products?.length && (
          <View
            style={[
              styles.container,
              {
                paddingHorizontal: 10,
                height: 140,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            <ActivityIndicator color={primaryColor} size={'small'} />
          </View>
        )}
        {!!products?.length && (
          <FlatList
            style={styles.container}
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
            keyExtractor={(item) => item.id + ''}
            data={products}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <Item onPress={onPress} item={item} />}
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: '#eee',
  },
});

const mapStateToProps = ({ home: { products, loading, isRehydrated } }) => {
  return {
    products,
    loading,
    isRehydrated,
  };
};

export default connect(mapStateToProps)(withNavigation(LatestItems));
