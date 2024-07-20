import memoizeOne from 'memoize-one';

export function noop() {}

export const formatPrice = (price) =>
  String(price).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

export const formatAccountButtonText = memoizeOne(function (user = {}) {
  if (!user?.id) return 'Sign-In';

  const { first_name, last_name, email } = user;
  const fullName =
    [first_name || '', last_name || ''].filter(Boolean).join(' ') || email;
  return ['Hi', fullName].filter(Boolean).join(', ');
});
