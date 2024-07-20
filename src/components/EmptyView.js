import React from 'react';
import { View, Text } from 'react-native';

export default ({ placeholder }) => (
  <View
    style={{
      flex: 1,
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text
      style={{
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '400',
        color: '#7E7E7E',
        marginBottom: 80,
      }}>
      {placeholder}
    </Text>
  </View>
);
