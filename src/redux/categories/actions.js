// import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import { UPDATE_CATEGORY } from './consts';
import { batch } from 'react-redux';
import showToast from '../../utils/toast';
import { prefetch } from '../../utils/imageCache';
import * as Api from '../../api/api';

const updateCategory = (category, data = {}) => ({
  type: UPDATE_CATEGORY,
  payload: {
    category,
    data,
  },
});

export const loadCategory = (type, force = false) => {
  return async (dispatch, getStore) => {
    try {
      if (!type) return;

      const isLoading = getStore()?.categories[type]?.loading;
      if (!force && isLoading) return;

      const existingItems = getStore()?.categories[type]?.items;

      batch(() => {
        dispatch(updateCategory(type, { noInternet: false }));

        if (!existingItems?.length) {
          dispatch(updateCategory(type, { loading: true }));
        }
      });

      const networkState = await NetInfo.fetch();
      if (!networkState.isInternetReachable && !existingItems?.length) {
        showToast('No Network Connection');
        dispatch(updateCategory(type, { loading: false, noInternet: true }));
        return;
      }

      const { data } = await Api.getItemsList(type);

      if (data?.error) {
        throw new Error(data.error);
      }

      // FastImage.preload(
      //   data.products
      //     ?.slice(0, Math.floor(data.products.length))
      //     .map((item) => item?.scaled_image || item?.images?.[0]?.src || '')
      //     .filter(Boolean)
      //     .map((src) => ({ uri: src, priority: FastImage.priority.high })),
      // );

      prefetch(
        data.products
          ?.slice(0, Math.floor(data.products.length))
          .map((item) => item?.scaled_image || item?.images?.[0]?.src || '')
          .filter(Boolean)
      );

      dispatch(
        updateCategory(type, {
          loading: false,
          noInternet: false,
          items: data.products,
        }),
      );
    } catch (e) {
      showToast(
        e.message === 'Network Error' ? 'No Network Connection' : e.message,
      );
      dispatch(updateCategory(type, { loading: false }));
    }
  };
};

export const preloadCategories = () => {
  return async (dispatch, getStore) => {
    try {
      const types = [
        'Orthodontics',
        'Equipments',
        'Oral-surgery',
        'Disposables',
        'Periodontics',
        'Prosthodontics',
        'Restoration',
        'Others',
      ];
      types.forEach((type) => dispatch(loadCategory(type, true)));
    } catch (e) {
      console.log('preloadCategories -> e', e);
    }
  };
};
