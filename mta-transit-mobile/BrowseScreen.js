import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

function BrowseScreen() {
  const stops = [
    { name: "1", backgroundColor: "#EE352E", textColor: "white" },
    { name: "2", backgroundColor: "#EE352E", textColor: "white" },
    { name: "3", backgroundColor: "#EE352E", textColor: "white" },
    { name: "4", backgroundColor: "#00933C", textColor: "white" },
    { name: "5", backgroundColor: "#00933C", textColor: "white" },
    { name: "6", backgroundColor: "#00933C", textColor: "white" },
    { name: "7", backgroundColor: "#B933AD", textColor: "white" },
    { name: "A", backgroundColor: "#0039A6", textColor: "white" },
    { name: "C", backgroundColor: "#0039A6", textColor: "white" },
    { name: "E", backgroundColor: "#0039A6", textColor: "white" },
    { name: "B", backgroundColor: "#FF6319", textColor: "white" },
    { name: "D", backgroundColor: "#FF6319", textColor: "white" },
    { name: "F", backgroundColor: "#FF6319", textColor: "white" },
    { name: "M", backgroundColor: "#FF6319", textColor: "white" },
    { name: "G", backgroundColor: "#6CBE45", textColor: "white" },
    { name: "J", backgroundColor: "#996633", textColor: "white" },
    { name: "Z", backgroundColor: "#996633", textColor: "white" },
    { name: "L", backgroundColor: "#A7A9AC", textColor: "white" },
    { name: "N", backgroundColor: "#FCCC0A", textColor: "white" },
    { name: "Q", backgroundColor: "#FCCC0A", textColor: "white" },
    { name: "R", backgroundColor: "#FCCC0A", textColor: "white" },
    { name: "S", backgroundColor: "#808183", textColor: "white" },
  ];

  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");

  const toStationInfo = (name) => {
    navigation.navigate("StationInfo", { state: name });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const getStationsInRows = () => {
    const stationsPerRow = [3, 4, 3, 4, 4, 4];
    let stationIndex = 0;

    return stationsPerRow.map((count, rowIndex) => {
      const rowStops = stops.slice(stationIndex, stationIndex + count);
      stationIndex += count;

      // Add empty circles if the row has less than the specified count
      const emptyCirclesCount = count - rowStops.length;
      for (let i = 0; i < emptyCirclesCount; i++) {
        rowStops.push({
          name: "",
          backgroundColor: "#f5f5f5",
          textColor: "#f5f5f5",
        });
      }

      return (
        <View key={rowIndex} style={styles.row}>
          {rowStops.map((stop, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toStationInfo(stop.name)}
              style={[styles.stop, { backgroundColor: stop.backgroundColor }]}
            >
              <Text style={[styles.stopText, { color: stop.textColor }]}>
                {stop.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of Stops</Text>
      <TextInput
        placeholder="Search route..."
        value={searchTerm}
        onChangeText={handleSearchChange}
        style={styles.input}
      />
      <View style={styles.stopsContainer}>{getStationsInRows()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  stopsContainer: {
    flex: 1,
    flexDirection: "column",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  stop: {
    width: 80, // Adjust the width as needed
    height: 60, // Adjust the height as needed
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 30, // Half the width and height for a perfect circle
  },
  stopText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BrowseScreen;
