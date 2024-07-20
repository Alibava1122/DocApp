import { LOAD_SEARCH_DATA, UPDATE_SEARCH_TEXT } from './consts';

const initialState = {
  searchText: '',
  searchData: [],
  searchResults: [],
};
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SEARCH_DATA: {
      const { searchData = [], searchResults = [] } = action.payload;
      return {
        ...state,
        searchData,
        searchResults,
      };
    }
    case UPDATE_SEARCH_TEXT: {
      const { searchText, searchResults } = action.payload;
      return {
        ...state,
        searchText,
        searchResults,
      };
    }
    default:
      return state;
  }
}
