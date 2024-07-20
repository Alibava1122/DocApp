import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Styles } from '../../../components';
import { primaryColor } from '../../../common/const';
import * as Api from '../../../api/api';
import { noop } from '../../../utils/utils';
import showToast from '../../../utils/toast';

export default ({ onCouponApplied = noop }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const onApplyPress = async () => {
    if (!!code.length) {
      let resultToastMessage = 'Coupon applied successfully';
      try {
        setLoading(true);
        const { data } = await Api.activateCoupon(code);
        if (data.status) {
          onCouponApplied({ ...data.coupon_data, code });
          setCode('');
          setApplied(true);
          return;
        }
        resultToastMessage = data.message;
      } catch (err) {
        resultToastMessage = 'Coupon not applied';
      } finally {
        showToast(resultToastMessage);
        setLoading(false);
      }
    }
  };

  if (applied) {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 40,
          width: 'auto',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Text style={{ color: '#7C7C7C' }}>
          {'The coupon has been applied!'}
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 40,
          width: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={primaryColor} size={'small'} />
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 40,
        width: 'auto',
      }}>
      <TextInput
        style={{
          flex: 1,
          paddingHorizontal: 8,
          backgroundColor: '#fff',
          borderColor: '#008477',
          borderWidth: 1,
          paddingVertical: 0,
          fontSize: 18,
        }}
        placeholder={'Enter Coupon Code'}
        returnKeyType={'done'}
        autoCapitalize={'none'}
        autoCorrect={false}
        value={code}
        onChangeText={setCode}
        textAlignVertical={'center'}
      />
      <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={onApplyPress}>
        <View
          style={{
            width: 100,
            height: 40,
            backgroundColor: primaryColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={Styles.buttonText}>{'APPLY'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
