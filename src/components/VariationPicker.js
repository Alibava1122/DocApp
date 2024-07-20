import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from '@react-native-community/picker';

const AndroidPicker = ({ title, value, onValueChange, options }) => {
  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={value} onValueChange={onValueChange}>
          <Picker.Item disabled label="Choose an option" value="-1" />
          {options.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

function getOptions(options) {
  const ops = options.map((item) => ({ label: item, value: item })) || [];
  return [{ label: 'Choose an option', value: undefined }, ...ops];
}
const IosPicker = ({
  title,
  value,
  setOpen,
  isOpen,
  options,
  onValueChange,
  zIndex,
  zIndexInverse,
}) => {
  const [items, setItems] = useState(getOptions(options));
  return (
    <View style={[styles.container, isOpen ? { zIndex: 10 } : {}]}>
      <Text style={styles.title}>{title}</Text>

      <DropDownPicker
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        open={isOpen}
        value={value}
        items={items}
        setOpen={setOpen}
        onSelectItem={(item) => onValueChange(item.value)}
        setItems={setItems}
      />
    </View>
  );
};

export default ({
  title = '',
  value = '',
  options = [],
  zIndex = 1,
  zIndexInverse = 1,
  onValueChange,
  isOpen = false,
  setOpen,
}) => {
  if (Platform.OS === 'ios') {
    return (
      <IosPicker
        title={title}
        isOpen={isOpen}
        options={options}
        setOpen={setOpen}
        value={value}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        onValueChange={onValueChange}
      />
    );
  }
  return (
    <AndroidPicker
      title={title}
      options={options}
      value={value}
      onValueChange={onValueChange}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
  },
  pickerContainer: {
    padding: 5,
    paddingRight: 0,
    marginHorizontal: 2,
    height: 39,
    marginTop: 2,
    borderWidth: 1,
    backgroundColor: '#F2F2F2',
    borderColor: '#CFCFCF',
    justifyContent: 'center',
  },
});
