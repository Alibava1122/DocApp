import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Styles } from './Styles';
import { noop } from '../utils/utils';

export default ({
  title,
  loader = false,
  slim = false,
  style = {},
  onPress = noop,
  disabled = false,
}) => {
  const buttonStyle = slim
    ? Styles.buttonContainerSlim
    : Styles.buttonContainer;
  if (!loader) {
    return (
      <TouchableOpacity
        style={[buttonStyle, style, disabled ? { opacity: 0.8 } : {}]}
        onPress={onPress}
        disabled={disabled}>
        <Text style={Styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[buttonStyle, style]}>
      <ActivityIndicator color="white" />
    </View>
  );
};
