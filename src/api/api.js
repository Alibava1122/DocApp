import Axios from 'axios';
import { setup } from 'axios-cache-adapter';
import urls from '../utils/urls';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const getLatestProducts = async function () {
  return Axios.get(urls.latestProducts);
};

export const getAllProducts = async function () {
  return Axios.get(urls.allProducts);
};

export const getUserData = async function (userId) {
  return Axios.get(urls.userData(userId));
};

export const login = async function ({ username, password }) {
  return Axios.post(
    urls.login,
    { username, password },
    {
      headers: DEFAULT_HEADERS,
    },
  );
};

export const logout = async function () {
  return Axios.get(urls.logout);
};

export const createUser = async function ({ email, password }) {
  return Axios.post(
    urls.createUser,
    { email, password },
    {
      headers: DEFAULT_HEADERS,
    },
  );
};

export const updateUser = async function (id, userData = {}) {
  return Axios.put(urls.saveProfile(id), userData, {
    headers: DEFAULT_HEADERS,
  });
};

export const resetPassword = async function (email) {
  return Axios.get(`${urls.resetPassword}${email}`);
};

export const getProduct = async function (id) {
  return Axios.get(urls.product(id));
};

export const placeOrder = async function (data = {}) {
  return Axios.post(urls.order, data, {
    headers: DEFAULT_HEADERS,
  });
};

export const addReview = async function (id, data = {}) {
  return Axios.post(urls.Addreviews(id), data, {
    headers: DEFAULT_HEADERS,
  });
};

export const getReviews = async function (id) {
  return Axios.get(urls.getReviews(id));
};

export const getOrders = async function (userid) {
  return Axios.get(urls.allOrders(userid));
};

export const updateOrder = async function (orderId) {
  return Axios.put(urls.orderUpdate(orderId));
};

export const getOrderDetails = async function (orderId) {
  return Axios.get(urls.orderDetails(orderId));
};

export const activateCoupon = async function (coupon = '') {
  const bodyFormData = new FormData();
  bodyFormData.append('coupon', coupon);
  return Axios.post(
    urls.couponInfo,
    bodyFormData,
    // headers: {'Content-Type': 'multipart/form-data' }
  );
};

export const getItemsList = async function (type) {
  const api = setup({
    cache: {
      maxAge: 15 * 60 * 1000,
    },
  });
  return api.get(
    urls.getItemsByType(type),
  );

};

