import React from "react";
import { View, Text, StyleSheet } from "react-native";

function FavoritesScreen({ isDarkModeEnabled }) {
  // Adjust the styles based on the dark mode state
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkModeEnabled ? "#333" : "#f5f5f5",
    },
    text: {
      color: isDarkModeEnabled ? "white" : "black",
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favorites Screen</Text>
    </View>
  );
}

export default FavoritesScreen;
