import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";
import MapScreen from "./MapScreen";
import FavoritesScreen from "./FavoritesScreen";
import BrowseScreen from "./BrowseScreen";
import SettingsScreen from "./SettingsScreen";
import StationInfoScreen from "./StationInfoScreen";
import SpecificStation from "./SpecificStation";

const Tab = createBottomTabNavigator();

const BrowseStack = createStackNavigator();

const BrowseStackScreen = () => (
  <BrowseStack.Navigator screenOptions={{ headerShown: false }}>
    <BrowseStack.Screen name="AllStations" component={BrowseScreen} />
    <BrowseStack.Screen name="SpecificStation" component={SpecificStation} />
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
          tabBarIcon: ({ color, focused }) => {
            let iconName;
            let iconSize = focused ? 23 : 20;

            if (route.name === "Map") {
              iconName = require("./assets/map_icon.png");
            } else if (route.name === "Favorites") {
              iconName = require("./assets/favorites_icon.png");
            } else if (route.name === "Browse") {
              iconName = require("./assets/browse_icon.png");
            } else if (route.name === "Settings") {
              iconName = require("./assets/settings_icon.png");
            }

            return (
              <Image
                source={iconName}
                style={{ tintColor: color, width: iconSize, height: iconSize }}
              />
            );
          },
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
          screenOptions={{
            initialParams: { isDarkModeEnabled, handleDarkModeChange },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
