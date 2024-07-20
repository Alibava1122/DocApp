import {
  SET_CART_PRODUCTS,
  CLEAR_CART_PRODUCTS,
  INC_CART_PRODUCT,
  DEC_CART_PRODUCT,
  REMOVE_CART_PRODUCT,
} from './consts';
import { batch } from 'react-redux';
import showToast from '../../utils/toast';

const setProducts = (products = []) => ({
  type: SET_CART_PRODUCTS,
  payload: { products },
});

export const clearCartProducts = () => ({
  type: CLEAR_CART_PRODUCTS,
});

export const incCartProducts = ({ id }) => ({
  type: INC_CART_PRODUCT,
  payload: { id },
});
export const decCartProducts = ({ id }) => ({
  type: DEC_CART_PRODUCT,
  payload: { id },
});
export const removeCartProducts = ({ id }) => ({
  type: REMOVE_CART_PRODUCT,
  payload: { id },
});

export const addToCart = (product = {}) => {
  return async (dispatch, getStore) => {
    const { products: existingProducts = [] } = getStore().cart;

    const sameAddedItem = existingProducts.find(
      ({ id, quantity, options = {} }) =>
        id === product.id &&
        quantity === product.quantity &&
        options?.size === product?.options?.size &&
        options?.color === product?.options?.color &&
        options?.type === product?.options?.type,
    );
    if (sameAddedItem) {
      alert('Item already in cart');
      return;
    }


    dispatch(
      setProducts([
        ...existingProducts,
        product,
      ]),
    );
    showToast('Product Added to Cart successfully!');
  };
};
