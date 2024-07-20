import { CLEAR_ORDERS, ADD_ORDER } from './consts';

const initialState = {
  orders: [],
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ORDER: {
      const { order } = action.payload;
      if (!order) return state;

      return {
        ...state,
        orders: [order, ...state.orders],
      };
    }
    case CLEAR_ORDERS: {
      return {
        ...initialState,
      };
    }

    default:
      return state;
  }
}
