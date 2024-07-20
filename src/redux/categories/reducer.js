import { UPDATE_CATEGORY } from './consts';

const initialState = {
  isRehydrated: false,
};
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'persist/REHYDRATE': {
      const categories = action?.payload?.categories || {}
      return {
        ...state,
        isRehydrated: true,
        ...categories
      };
    }

    case UPDATE_CATEGORY: {
      const {category, data = {}} = action.payload;
      return {
        ...state,
        [category]: {
          ...(state[category] || {}),
          ...data
        }
      };
    }

    default:
      return state;
  }
}
