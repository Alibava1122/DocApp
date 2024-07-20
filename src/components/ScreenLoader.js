import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Styles } from './Styles';
import { primaryColor } from '../common/const';

export default () => {
  return (
    <View
      style={{
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={[Styles.normalText, {fontSize: 18,  marginBottom: 30 }]}>
        {'Please wait...'}
      </Text>
      <ActivityIndicator color={primaryColor} size={"large"} />
    </View>
  );
};
