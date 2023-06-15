import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

function FavoritesScreen() {
  const isDarkModeEnabled = useSelector(state => state.darkModeReducer);

  const containerStyle = {
    ...styles.container,
    backgroundColor: isDarkModeEnabled ? "#333" : "#f5f5f5",
  };

  const textStyle = {
    ...styles.text,
    color: isDarkModeEnabled ? "white" : "black",
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>Favorites Screen</Text>
    </View>
  );
}

export default FavoritesScreen;
