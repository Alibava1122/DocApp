import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { primaryColor } from '../common/const';

import { noop } from '../utils/utils';

const StepperButton = ({ onPress, source, style = {} }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      width: 35,
      height: 35,
      padding: 10,
      backgroundColor: primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}>
    <Image
      style={{
        width: 16,
        height: 16,
      }}
      resizeMode="cover"
      resizeMethod="scale"
      source={source}
    />
  </TouchableOpacity>
);

export default ({ onPlus = noop, onMinus = noop, title = '' }) => (
  <View key="counter" style={{ flexDirection: 'row' }}>
    <StepperButton
      style={{ marginRight: 1 }}
      onPress={onMinus}
      source={require('../../assets/subtraction.png')}
    />
    <View
      style={{
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: primaryColor,
        marginRight: 1.5,
      }}>
      <Text style={styles.counterText}>{title}</Text>
    </View>
    <StepperButton
      style={{ width: 40 }}
      onPress={onPlus}
      source={require('../../assets/addition.png')}
    />
  </View>
);

const styles = StyleSheet.create({
  counterText: {
    width: 40,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
