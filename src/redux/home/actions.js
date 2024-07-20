// import FastImage from 'react-native-fast-image';
import { SET_LATEST_PRODUCTS, SET_LATEST_PRODUCTS_LOADING } from './consts';
import { batch } from 'react-redux';
import showToast from '../../utils/toast';
import { prefetch } from '../../utils/imageCache';
import * as Api from '../../api/api';

const setProductsLoading = (loading) => ({
  type: SET_LATEST_PRODUCTS_LOADING,
  payload: loading,
});

const setProducts = (products = []) => ({
  type: SET_LATEST_PRODUCTS,
  payload: { products },
});

export const loadLatestProducts = () => {
  return async (dispatch, getStore) => {
    try {
      if (Date.now() - getStore().home.loadedTimestamp < 60 * 1000) {
        return;
      }

      if (!getStore().home?.products?.length) {
        dispatch(setProductsLoading(true));
      }
      const { data } = await Api.getLatestProducts();

      if (data?.error) {
        throw new Error(data.error);
      }

      // FastImage.preload(
      //   data.products
      //     ?.map((item) => item?.scaled_image || item?.images?.[0]?.src || '')
      //     .filter(Boolean)
      //     .map((src) => ({ uri: src, priority: FastImage.priority.high })),
      // );

      prefetch(
        data.products
          ?.map((item) => item?.scaled_image || item?.images?.[0]?.src || '')
          .filter(Boolean)
      );

      // setTimeout(() => {
      //   batch(() => {
      //     dispatch(setProductsLoading(false));
      //     dispatch(setProducts(data.products));
      //   });
      // }, 500);
      batch(() => {
        dispatch(setProductsLoading(false));
        dispatch(setProducts(data.products));
      });
    } catch (e) {
      console.log('loadLatestProducts -> error', e);
      dispatch(setProductsLoading(false));
      showToast(
        e.message === 'Network Error' ? 'No Network Connection' : e.message,
      );
    }
  };
};
