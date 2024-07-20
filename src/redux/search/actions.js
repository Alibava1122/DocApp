import {
  LOAD_SEARCH_DATA,
  CLEAR_SEARCH_DATA,
  UPDATE_SEARCH_TEXT,
} from './consts';

import * as Api from '../../api/api';

const getSearchResults = function (searchText = '', searchData = []) {
  if (!searchText) return [];
  const filter = searchText.toLowerCase().trim();
  return searchData.filter((item) =>
    item.title?.toLowerCase().includes(filter),
  );
};

export const loadSearchData = () => {
  return async (dispatch, getStore) => {
    try {
      const { searchData: loadedSearchData = [] } = getStore().search;

      if (loadedSearchData.length) {
        return;
      }

      const { data: searchData = [] } = await Api.getAllProducts();
      const { searchText } = getStore().search;
      dispatch({
        type: LOAD_SEARCH_DATA,
        payload: {
          searchData,
          searchResults: getSearchResults(searchText, searchData),
        },
      });
    } catch (err) {
      console.log('loadSearchData -> err', err);
    }
  };
};

export const clearSearchData = () => ({
  type: CLEAR_SEARCH_DATA,
  payload: {},
});

export const updateSearchText = (searchText) => {
  return async (dispatch, getStore) => {
    const {
      searchResults = [],
      searchData = [],
      searchText: prevSearchText = '',
    } = getStore().search;
    try {
      if (!searchText && !prevSearchText && !searchResults.length) return;
      dispatch({
        type: UPDATE_SEARCH_TEXT,
        payload: {
          searchText,
          searchResults: !!searchText
            ? getSearchResults(
                searchText,
                searchResults.length > prevSearchText.length
                  ? searchResults
                  : searchData,
              )
            : [],
        },
      });
    } catch (err) {
      console.log('updateSearchText -> err', err);
    }
  };
};
