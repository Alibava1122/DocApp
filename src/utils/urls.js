import keys from './keys';

export default {
  createUser:
    'https://edentalmart.com/wp-json/myedentalmarttheme/v1/wishlistapi/user/create',
  login:
    'https://edentalmart.com/wp-json/myedentalmarttheme/v1/wishlistapi/user/login',
  resetPassword:
    'https://edentalmart.com/wp-json/myedentalmarttheme/v1/wishlistapi/user/forgotPassword?user_email=',
  wishlist: (userId) =>
    'https://edentalmart.com/wp-json/myedentalmarttheme/v1/wishlistapi/read/' +
    userId,
  addToWishList:
    'https://edentalmart.com/wp-json/myedentalmarttheme/v1/wishlistapi/add',
  logout:
    'https://edentalmart.com/wp-json/myedentalmarttheme/v1/wishlistapi/user/logout',
  userData: (userid) =>
    'https://edentalmart.com/wp-json/wc/v2/customers/' +
    userid +
    '?consumer_secret=' +
    keys.consumer_secret +
    '&consumer_key=' +
    keys.consumer_key,

  saveProfile: (Userid) =>
    'https://edentalmart.com/wp-json/wc/v2/customers/' +
    Userid +
    '?consumer_secret=' +
    keys.consumer_secret +
    '&consumer_key=' +
    keys.consumer_key,

  removeWishlistItem: (userId, productId) =>
    'https://edentalmart.com/wp-json/myedentalmarttheme/v1/wishlistapi/delete?user_id=' +
    userId +
    '&product_id=' +
    productId,

  order:
    'https://edentalmart.com/wp-json/wc/v2/orders?consumer_secret=' +
    keys.consumer_secret +
    '&consumer_key=' +
    keys.consumer_key,

  allOrders: (userid) =>
    'https://edentalmart.com/wp-json/wc/v2/orders?customer=' +
    userid +
    '&consumer_secret=' +
    keys.consumer_secret +
    '&consumer_key=' +
    keys.consumer_key,

  product: (id) =>
    'https://edentalmart.com/wc-api/v2/products/' +
    id +
    '?consumer_secret=' +
    keys.consumer_secret +
    '&consumer_key=' +
    keys.consumer_key,

  searchProduct: (product) =>
    'https://edentalmart.com/wp-json/wc/v3/products?search=' +
    product +
    '&consumer_secret=' +
    keys.consumer_secret +
    '&consumer_key=' +
    keys.consumer_key,

  // latestProducts:  "https://edentalmart.com/wp-json/wc/v2/products?orderby=date&per_page=12&order=desc&consumer_secret=" +
  //   keys.consumer_secret + "&consumer_key=" +
  //   keys.consumer_key,

  latestProducts: 'https://edentalmart.com/data/latest.json',
  allProducts: 'https://edentalmart.com/data/allproducts.json',

  orderDetails: (id) =>
    'https://edentalmart.com/wc-api/v2/orders/' +
    id +
    '/?consumer_secret=' +
    keys.consumer_secret +
    '&consumer_key=' +
    keys.consumer_key,

  orderUpdate: (id) =>
    'https://edentalmart.com/wp-json/wc/v2/orders/' +
    id +
    '?consumer_secret=' +
    keys.consumer_secret +
    '&consumer_key=' +
    keys.consumer_key +
    '&status=completed',

  Addreviews: (id) =>
    'https://edentalmart.com/wp-json/wc/v2/products/' +
    id +
    '/reviews?consumer_secret=' +
    keys.consumer_secret +
    '&consumer_key=' +
    keys.consumer_key,

  getReviews: (id) =>
    'https://edentalmart.com/wc-api/v2/products/' +
    id +
    '/reviews?consumer_secret=' +
    keys.consumer_secret +
    '&consumer_key=' +
    keys.consumer_key,

  couponInfo: 'https://sr7demosrvr.sr7.tech/retrive_coupon_info/',

  getItemsByType: (type) => `https://www.edentalmart.com/data/${type}.json`,
};
