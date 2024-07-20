import React from 'react';
import { View, Text } from 'react-native';

export default ({ title = 'E-Dental Mart' }) => (
  <View>
    <Text
      style={{
        fontSize: 22,
        marginStart: 10,
        color: '#fff',
      }}>
      {title}
    </Text>
  </View>
);
