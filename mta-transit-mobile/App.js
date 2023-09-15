// App.js
import React, { useEffect } from "react";
import AppNavigator from "./AppNavigator";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { darkModeReducer, starredStationsReducer, initStarredList } from './redux/reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const store = configureStore({
  reducer: {
    darkModeReducer: darkModeReducer,
    starredStationsReducer: starredStationsReducer,
  },
});

function App() {
  useEffect(() => {
    const initializeStarredStations = async () => {
      try {
        const starredStations = await AsyncStorage.getItem('starredStations');
        if (starredStations !== null) {
          const parsedStarredStations = JSON.parse(starredStations);
          store.dispatch(initStarredList(parsedStarredStations));
        }
      } catch (error) {
        console.error('Error initializing starred stations from AsyncStorage: ', error);
      }
    };

    initializeStarredStations();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

export default App;
