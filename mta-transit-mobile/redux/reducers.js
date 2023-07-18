export const darkModeReducer = (state = false, action) => {
  switch (action.type) {
    case "TOGGLE_DARK_MODE":
      return !state;
    default:
      return state;
  }
};

export const starredStationsReducer = (state = ["2d15"], action) => {
  switch (action.type) {
    case 'ADD_TO_STARRED_LIST':
      return [...state, action.payload];
    default:
      return state;
  }
};