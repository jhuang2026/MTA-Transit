import React from "react";
import AppNavigator from "./AppNavigator";

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { darkModeReducer, starredStationsReducer } from './redux/reducers';

const store = configureStore({
  reducer: {
    darkModeReducer: darkModeReducer,
    starredStationsReducer: starredStationsReducer,
  },
});

function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

export default App;
