import { SET_USER, SET_USER_LOADING, CLEAR_USER, UPDATE_USER } from './consts';
import { batch } from 'react-redux';
// import showToast from '../../utils/toast';

import * as Api from '../../api/api';

const setUserLoading = (loading) => ({
  type: SET_USER_LOADING,
  payload: loading,
});

const setUser = (user = {}) => ({
  type: SET_USER,
  payload: { user },
});

const updateUser = (user = {}) => ({
  type: UPDATE_USER,
  payload: { user },
});

const clearUser = () => ({
  type: CLEAR_USER,
});

const defaultErrorMessage = "Couldn't process the request, try again.";

export const loginUser = ({ username, password }) => {
  return async (dispatch, getStore) => {
    try {
      dispatch(setUserLoading(true));
      const { data } = await Api.login({
        username,
        password,
      });
      // console.log('loginUser -> data', data);
      if (data?.error) {
        throw new Error(data.error);
      }
      const { data: userData } = await Api.getUserData(data.user.ID);
      // console.log('loginUser -> userData', userData);
      if (userData?.error) {
        throw new Error(userData.error);
      }

      batch(() => {
        dispatch(setUserLoading(false));
        dispatch(setUser(userData));
      });
    } catch (e) {
      console.log('loginUser -> error', e);
      dispatch(setUserLoading(false));
      throw new Error(e.message || defaultErrorMessage);
    }
  };
};

export const logoutUser = () => {
  return async (dispatch, getStore) => {
    try {
      dispatch(setUserLoading(true));
      await Api.logout();
      batch(() => {
        dispatch(clearUser());
        dispatch(setUserLoading(false));
      });
    } catch (e) {
      console.log('logoutUser -> error', e);
      setUserLoading(false);
      throw new Error(e.message || defaultErrorMessage);
    }
  };
};

export const createUser = ({ email, password }) => {
  return async (dispatch, getStore) => {
    try {
      dispatch(setUserLoading(true));
      const { data } = await Api.createUser({
        email,
        password,
      });
      console.log('createUser -> data', data);
      if (data?.error) {
        throw new Error(data.error);
      }

      const { data: userData } = await Api.getUserData(data.user.ID);
      console.log('createUser -> userData', userData);
      if (userData?.error) {
        throw new Error(userData.error);
      }

      batch(() => {
        dispatch(setUserLoading(false));
        dispatch(setUser(userData));
      });
    } catch (e) {
      console.log('createUser -> error', e);
      dispatch(setUserLoading(false));
      throw new Error(e.message || defaultErrorMessage);
    }
  };
};

export const loadUserData = () => {
  return async (dispatch, getStore) => {
    try {
      const id = getStore().user.user?.id;
      if (!id) return;

      const { data: userData } = await Api.getUserData(id);
      console.log('loadUserData -> userData', userData);
      if (userData?.error) {
        throw new Error(userData.error);
      }
      dispatch(updateUser(userData));
    } catch (e) {
      console.log('loadUserData -> error', e);
    }
  };
};

export const updateUserData = (userData = {}) => {
  return async (dispatch, getStore) => {
    try {
      const id = getStore().user.user?.id;
      if (!id) return;

      dispatch(setUserLoading(true));
      const { data } = await Api.updateUser(id, userData);
      console.log('updateUserData -> data', data);
      if (data?.error) {
        throw new Error(data.error);
      }

      batch(() => {
        dispatch(setUserLoading(false));
        dispatch(updateUser(userData));
      });
    } catch (e) {
      console.log('updateUserData -> error', e);
      dispatch(setUserLoading(false));
      throw new Error(e.message || defaultErrorMessage);
    }
  };
};
