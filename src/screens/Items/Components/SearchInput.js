import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';

import { updateSearchText } from '../../../redux/search/actions';

const SearchInputComponent = ({ dispatch, searchText = '', isFocused }) => {
  const onChangeText = (value) => {
    dispatch(updateSearchText(value));
  };
  const onClearPress = () => {
    dispatch(updateSearchText(''));
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingStart: 10,
        ...Platform.select({
          ios: {
            height: 30,
            marginStart: 10,
          },
          android: {
            height: 35,
            marginEnd: 20,
            paddingEnd: 0,
          },
        }),
      }}>
      <TextInput
        style={{ flex: 1, fontSize: 15, paddingVertical: 0, paddingRight: 0 }}
        placeholder="Search items..."
        autoFocus={isFocused}
        textAlignVertical={'center'}
        value={searchText}
        onChangeText={onChangeText}
      />
      <View
        style={{
          width: 25,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: 5,
        }}>
        {!!searchText.length && (
          <TouchableOpacity onPress={onClearPress}>
            <Image
              style={{ height: 20, width: 20, tintColor: '#B8B8B8' }}
              resizeMode="cover"
              source={require('../../../../assets/cancel-text.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const mapStateToProps = ({ search: { searchText } }) => ({
  searchText,
});

export default connect(mapStateToProps)(
  withNavigationFocus(SearchInputComponent),
);
