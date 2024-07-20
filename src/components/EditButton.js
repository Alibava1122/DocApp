import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import { Styles } from './Styles';
import { primaryColor } from '../common/const';

import { noop } from '../utils/utils';

export default ({ onPress = noop, style = {} }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
      },
      style,
    ]}>
    <Text style={[Styles.subTitle, { fontSize: 14, color: primaryColor }]}>
      {'EDIT'}
    </Text>
    <Image
      style={{
        width: 13,
        height: 13,
        marginStart: 10,
      }}
      resizeMode="cover"
      resizeMethod="scale"
      source={require('../../assets/editicon.png')}
    />
  </TouchableOpacity>
);
