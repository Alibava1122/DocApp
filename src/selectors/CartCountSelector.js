import memoizeOne from 'memoize-one';

export default memoizeOne(function (products = []) {
  return products.reduce((result, item) => {
    return result + parseInt(item.quantity);
  }, 0);
});
