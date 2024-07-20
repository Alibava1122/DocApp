import React from 'react';
import { View } from 'react-native';
import { Styles } from '../../../components';

export default (props) => {
  return (
    <View
      style={[
        {
          backgroundColor: '#fff',
          borderRadius: 10,
          padding: 10,
          paddingStart: 15,
          paddingEnd: 15,
          marginTop: 10,
        },
        Styles.viewShadow,
        props.style,
      ]}>
      {props.children}
    </View>
  );
};
