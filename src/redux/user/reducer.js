import { SET_USER, UPDATE_USER, CLEAR_USER, SET_USER_LOADING } from './consts';

const initialState = {
  user: {},
  loading: false,
};
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      const { user = {} } = action.payload;
      return {
        ...state,
        user,
      };
    }
    case UPDATE_USER: {
      const { user = {} } = action.payload;
      return {
        ...state,
        user: { ...state.user, ...user },
      };
    }
    case CLEAR_USER: {
      return initialState;
    }
    case SET_USER_LOADING: {
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
