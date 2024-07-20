import { ADD_ORDER, CLEAR_ORDERS } from './consts';

export const addOrder = (order) => ({
  type: ADD_ORDER,
  payload: { order },
});

export const clearOrders = () => ({
  type: CLEAR_ORDERS,
});
