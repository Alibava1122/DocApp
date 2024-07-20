import { SET_LATEST_PRODUCTS, SET_LATEST_PRODUCTS_LOADING } from './consts';

const initialState = {
  products: [],
  loading: false,
  isRehydrated: false,
  loadedTimestamp: 0,
};
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'persist/REHYDRATE': {
      const home = action?.payload?.home || {}
      return {
        ...state,
        isRehydrated: true,
        ...home
      };
    }
    case SET_LATEST_PRODUCTS: {
      const { products = [] } = action.payload;
      return {
        ...state,
        products,
        loadedTimestamp: Date.now(),
      };
    }
    case SET_LATEST_PRODUCTS_LOADING: {
      const loading = action.payload;
      return {
        ...state,
        loading,
      };
    }

    default:
      return state;
  }
}
