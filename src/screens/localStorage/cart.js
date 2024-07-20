import AsyncStorage from '@react-native-community/async-storage';

import keys from './keys';

export const getCart = async () => {
  try {
    const value = await AsyncStorage.getItem(keys.CART_ITEMS);

    if (!!value) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('getCart', error);
  }
};

export const remove = async () => {
  try {
    await AsyncStorage.removeItem(keys.CART_ITEMS);
    console.log('removed ');
    return true;
  } catch (error) {
    console.error('Remove error: ', error);
  }
  return false;
};

export const setCartArray = async (data) => {
  try {
    await AsyncStorage.setItem(keys.CART_ITEMS, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('setCartArray error: ', error);
  }
  return false;
};

export const set = async (data) => {
  try {
    const savedData = await AsyncStorage.getItem(keys.CART_ITEMS);
    const dataToSave = !!savedData ? [...JSON.parse(savedData), data] : [data];
    await AsyncStorage.setItem(keys.CART_ITEMS, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('set error ', error);
  }
  return false;
};
