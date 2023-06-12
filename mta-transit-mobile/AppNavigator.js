import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './MapScreen';
import FavoritesScreen from './FavoritesScreen';
import BrowseScreen from './BrowseScreen';
import SettingsScreen from './SettingsScreen';
import StationInfoScreen from './StationInfoScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BrowseStack = createStackNavigator();

const BrowseStackScreen = () => (
  <BrowseStack.Navigator>
    <BrowseStack.Screen name="All Stations" component={BrowseScreen} />
    <BrowseStack.Screen name="Station Info" component={StationInfoScreen} />
  </BrowseStack.Navigator>
);

function AppNavigator() {
  const isDarkModeEnabled = false; // Set your initial dark mode state here

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          screenProps: { isDarkModeEnabled }, // Pass the isDarkModeEnabled prop to each screen
        }}
      >
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="Browse" component={BrowseStackScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;