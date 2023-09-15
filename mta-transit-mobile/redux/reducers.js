export const darkModeReducer = (state = false, action) => {
  switch (action.type) {
    case "TOGGLE_DARK_MODE":
      return !state;
    default:
      return state;
  }
};

import AsyncStorage from '@react-native-async-storage/async-storage';

// Define action types
const ADD_TO_STARRED_LIST = 'ADD_TO_STARRED_LIST';
const REMOVE_FROM_STARRED_LIST = 'REMOVE_FROM_STARRED_LIST';
const INIT_STARRED_LIST = 'INIT_STARRED_LIST'; // New action type for initializing from AsyncStorage

// Define action creators
export const addToStarredList = (stationId) => ({
  type: ADD_TO_STARRED_LIST,
  payload: stationId,
});

export const removeFromStarredList = (stationId) => ({
  type: REMOVE_FROM_STARRED_LIST,
  payload: stationId,
});

export const initStarredList = (stations) => ({
  type: INIT_STARRED_LIST,
  payload: stations,
});

// Reducer
export const starredStationsReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_STARRED_LIST:
      const updatedStateAdd = [...state, action.payload];
      AsyncStorage.setItem('starredStations', JSON.stringify(updatedStateAdd));
      return updatedStateAdd;

    case REMOVE_FROM_STARRED_LIST:
      const updatedStateRemove = state.filter(stationId => stationId !== action.payload);
      AsyncStorage.setItem('starredStations', JSON.stringify(updatedStateRemove));
      return updatedStateRemove;

    case INIT_STARRED_LIST:
      return action.payload;

    default:
      return state;
  }
};
