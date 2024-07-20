import AsyncStorage from '@react-native-community/async-storage';

const set = async (value, key) => {
  try {
    const val = JSON.stringify(value);
    console.log('setttt ' + val);

    await AsyncStorage.setItem(key, val);
  } catch (error) {
    console.log(error);
  }
};

const remove = async (key) => {
  try {
    console.log('removee ', key);

    return await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('error', error);
    //errorHandler(error);
  }
};

const get = async (key, cb) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) {
      throw 'null';
    }
    console.log('gettttt userrrrr' + value);
    return value;
  } catch (error) {
    if (error === 'null') {
      return '';
    }
    console.log('errorr ' + error);
  }
};

export { set, get, remove };
