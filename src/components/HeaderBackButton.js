import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

import { noop } from '../utils/utils';

export default ({ onPress = noop }) => (
  <TouchableOpacity onPress={onPress}>
    <Image
      style={{
        width: 25,
        height: 25,
        marginStart: 20,
      }}
      resizeMode="cover"
      resizeMethod="scale"
      source={require('../../assets/back-arrow.png')}
    />
  </TouchableOpacity>
);
