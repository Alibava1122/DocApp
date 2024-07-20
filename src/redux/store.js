import {
  createStore,
  /* compose, */ applyMiddleware,
  combineReducers,
} from 'redux';
// import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from '@react-native-community/async-storage';
import { composeWithDevTools } from 'redux-devtools-extension';

import homeReducer from './home/reducer';
import userReducer from './user/reducer';
import searchReducer from './search/reducer';
import cartReducer from './cart/reducer';
import ordersReducer from './orders/reducer';
import categoriesReducer from './categories/reducer';

const reducers = combineReducers({
  home: homeReducer,
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  orders: ordersReducer,
  categories: categoriesReducer,
});

const middlewares = applyMiddleware(
  thunkMiddleware,
  //, logger
);

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(
  persistedReducer,
  composeWithDevTools(middlewares),
);
export const persistor = persistStore(store);
