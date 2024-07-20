import {
  CLEAR_CART_PRODUCTS,
  REMOVE_CART_PRODUCT,
  INC_CART_PRODUCT,
  DEC_CART_PRODUCT,
  SET_CART_PRODUCTS,
} from './consts';

const initialState = {
  products: [],
};
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CART_PRODUCTS: {
      const { products = [] } = action.payload;
      return {
        ...state,
        products,
      };
    }
    case REMOVE_CART_PRODUCT: {
      const { id } = action.payload;
      return {
        ...state,
        products: state.products.filter((item) => item.id !== id),
      };
    }
    case INC_CART_PRODUCT: {
      const { id } = action.payload;
      return {
        ...state,
        products: state.products.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        }),
      };
    }
    case DEC_CART_PRODUCT: {
      const { id } = action.payload;
      return {
        ...state,
        products: state.products.map((item) => {
          if (item.id === id && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        }),
      };
    }
    case CLEAR_CART_PRODUCTS: {
      return {
        ...initialState,
      };
    }

    default:
      return state;
  }
}
