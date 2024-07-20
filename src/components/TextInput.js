import React, { useState } from 'react';
import { TextInput } from 'react-native';

export default ({ style, focusedStyle = {}, ...props }) => {
  const [isFocused, setFocused] = useState(false);
  const onFocus = () => {
    setFocused(true);
  };
  const onBlur = () => {
    setFocused(false);
  };
  return (
    <TextInput
      {...props}
      style={[style, isFocused ? focusedStyle : {}]}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
