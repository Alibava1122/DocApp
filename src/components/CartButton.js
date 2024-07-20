import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import IconBadge from 'react-native-icon-badge';
import cartCountSelector from '../selectors/CartCountSelector';

const CartButton = ({ navigation, count = 0 }) => (
  <IconBadge
    MainElement={
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CartView');
        }}>
        <Image
          style={{
            width: 30,
            height: 30,
            marginStart: 10,
            marginEnd: 15,
          }}
          resizeMode="contain"
          source={require('../../assets/addtocard.png')}
        />
      </TouchableOpacity>
    }
    BadgeElement={<Text style={{ color: '#FFFFFF' }}>{count}</Text>}
    IconBadgeStyle={{
      minWidth: 20,
      height: 20,
      marginTop: -8,
      marginEnd: 3,
      paddingHorizontal: 2,
      backgroundColor: '#ff0000',
    }}
    Hidden={count == 0}
  />
);

const mapStateToProps = ({ cart: { products } }) => {
  return {
    count: cartCountSelector(products),
  };
};

export default connect(mapStateToProps)(withNavigation(CartButton));
