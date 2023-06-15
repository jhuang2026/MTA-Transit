import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from './redux/actions';

function SettingsScreen() {
  const navigation = useNavigation();

  const isDarkModeEnabled = useSelector(state => state.darkModeReducer);
  const dispatch = useDispatch();
  const handleDarkModeChange = () => {
    dispatch(toggleDarkMode());
  };

  const handleCityPress = () => {
    // Handle city button press
    // You can add your desired logic here
  };

  const handleSpreadTheWordPress = () => {
    // Handle "Spread the word" button press
    // You can add your desired logic here
  };

  const handleRateAppPress = () => {
    // Handle "Rate app" button press
    // You can add your desired logic here
  };

  const handleShareWithFriendsPress = () => {
    // Handle "Share with friends" button press
    // You can add your desired logic here
  };

  const handleUpgradeRemoveAdsPress = () => {
    // Handle "Upgrade & Remove Ads" button press
    // You can add your desired logic here
  };

  const handleManagePermissionsPress = () => {
    // Handle "Manage Permissions" button press
    // You can add your desired logic here
  };

  const handleRestorePurchasesPress = () => {
    // Handle "Restore Purchases" button press
    // You can add your desired logic here
  };

  return (
    <View style={[styles.container, isDarkModeEnabled && styles.containerDark]}>

      <Text
        style={[
          styles.sectionTitle,
          isDarkModeEnabled && styles.sectionTitleDark,
        ]}
      >
        City
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleCityPress}>
        <Text style={styles.buttonText}>New York City</Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.sectionTitle,
          isDarkModeEnabled && styles.sectionTitleDark,
        ]}
      >
        Appearance
      </Text>
      <View
        style={[
          styles.appearanceContainer,
          isDarkModeEnabled && styles.appearanceContainerDark,
        ]}
      >
        <Text style={[styles.appearanceText, isDarkModeEnabled && styles.appearanceTextDark]}>
          Dark Mode
        </Text>
        <Switch value={isDarkModeEnabled} onValueChange={handleDarkModeChange} />
      </View>

      <Text
        style={[
          styles.sectionTitle,
          isDarkModeEnabled && styles.sectionTitleDark,
        ]}
      >
        Spread the Word
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleRateAppPress}>
        <Text style={styles.buttonText}>Rate App</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleShareWithFriendsPress}
      >
        <Text style={styles.buttonText}>Share with Friends</Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.sectionTitle,
          isDarkModeEnabled && styles.sectionTitleDark,
        ]}
      >
        Proximity Pro
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleUpgradeRemoveAdsPress}
      >
        <Text style={styles.buttonText}>Upgrade & Remove Ads</Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.sectionTitle,
          isDarkModeEnabled && styles.sectionTitleDark,
        ]}
      >
        Manage Permissions
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleManagePermissionsPress}
      >
        <Text style={styles.buttonText}>Manage Permissions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRestorePurchasesPress}
      >
        <Text style={styles.buttonText}>Restore Purchases</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  containerDark: {
    backgroundColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  titleDark: {
    color: "white",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitleDark: {
    color: "white",
  },
  button: {
    backgroundColor: "#0099FF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  appearanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  appearanceContainerDark: {
    borderColor: "white",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  appearanceText: {
    fontSize: 16,
  },
  appearanceTextDark: {
    color: "white",
  },
});

export default SettingsScreen;
