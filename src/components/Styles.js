import { StyleSheet } from 'react-native';

import { primaryColor } from '../common/const';

export const Styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: primaryColor,
    height: 50,
    elevation: 1,
    marginHorizontal: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainerSlim: {
    backgroundColor: primaryColor,
    height: 40,
    elevation: 1,
    marginHorizontal: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 14, color: '#fff', fontWeight: '700' },

  viewShadow: {
    elevation: 2,
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },

  normalText: {
    color: '#7E7E7E',
    fontSize: 15,
    fontWeight: '400',
  },

  subTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
});
