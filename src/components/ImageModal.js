import React from 'react';
import { Modal, Pressable, Image } from 'react-native';

import { noop } from '../utils/utils';

export default ({ src, visible, onClose = noop }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <Pressable
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
      onPress={onClose}>
      {!!src && (
        <Image
          style={{ width: '80%', aspectRatio: 1, borderRadius: 3 }}
          source={{ uri: src }}
        />
      )}
    </Pressable>
  </Modal>
);
