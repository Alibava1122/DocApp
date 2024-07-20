import React, { useState } from 'react';
import { Image, View } from 'react-native';
// import FastImage from 'react-native-fast-image';

export default ({
  uri = '',
  // resizeMode = FastImage.resizeMode.cover,
  resizeMode = 'cover',
  style = {},
}) => {
  return (
    <Image
      resizeMode={resizeMode}
      resizeMethod={'scale'}
      style={style}
      source={!!uri ? { uri } : require('../../assets/placeholder.png')}
      defaultSource={require('../../assets/placeholder.png')}
      // loadingIndicatorSource={require('../../assets/placeholder.png')}
    />
  );
  // const [showDefaultImage, setShowDefaultImage] = useState(true);

  // return (
  //   <View>
  //     {!!showDefaultImage && (
  //       <Image
  //         resizeMode={resizeMode}
  //         resizeMethod={'scale'}
  //         style={[style, { position: 'absolute', left: 0, right: 0 }]}
  //         source={require('../../assets/placeholder.png')}
  //       />
  //     )}
  //     {!!uri && <FastImage
  //       resizeMode={resizeMode}
  //       style={style}
  //       source={{
  //         uri,
  //         priority: FastImage.priority.high,
  //         cache: FastImage.cacheControl.immutable,
  //       }}
  //       // onLoadStart={()=> setShowDefaultImage(true)}
  //       onLoadEnd={()=> setShowDefaultImage(false)}
  //       onError={()=> setShowDefaultImage(true)}
  //     />}
  //   </View>
  // );
};
