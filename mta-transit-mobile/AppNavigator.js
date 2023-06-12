import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './MapScreen';
import FavoritesScreen from './FavoritesScreen';
import BrowseScreen from './BrowseScreen';
import SettingsScreen from './SettingsScreen';
import StationInfoScreen from './StationInfoScreen';

const Tab = createBottomTabNavigator();

const BrowseStack = createStackNavigator();

const BrowseStackScreen = () => (
  <BrowseStack.Navigator>
    <BrowseStack.Screen name="AllStations" component={BrowseScreen} />
    <BrowseStack.Screen name="StationInfo" component={StationInfoScreen} />
  </BrowseStack.Navigator>
);

function AppNavigator() {
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(true);

  const handleDarkModeChange = (newMode) => {
    setIsDarkModeEnabled(newMode);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          screenProps: { isDarkModeEnabled }, // Pass the isDarkModeEnabled prop to each screen
        })}
      >
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Favorites">
          {() => <FavoritesScreen isDarkModeEnabled={isDarkModeEnabled} />}
        </Tab.Screen>
        <Tab.Screen name="Browse" component={BrowseStackScreen} />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            // Pass the isDarkModeEnabled state and handleDarkModeChange function as screenParams
            screenParams: { isDarkModeEnabled, handleDarkModeChange },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
