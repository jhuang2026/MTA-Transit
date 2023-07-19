export const toggleDarkMode = () => {
  return {
    type: "TOGGLE_DARK_MODE",
  };
};

export const addToStarredList = (stationId) => {
  return {
    type: 'ADD_TO_STARRED_LIST',
    payload: stationId,
  };
};

export const removeFromStarredList = (stationId) => {
  return {
    type: "REMOVE_FROM_STARRED_LIST",
    payload: stationId,
  };
};