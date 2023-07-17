import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import stationsData from "./assets/stations.json";
import { Ionicons } from "@expo/vector-icons";


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
  const [filteredStations, setFilteredStations] = useState([]);
  const isDarkModeEnabled = useSelector(state => state.darkModeReducer);

  const dynamicStyles = useMemo(() => {
    return isDarkModeEnabled ? darkStyles : lightStyles;
  }, [isDarkModeEnabled]);

  const toStationInfo = (name) => {
    navigation.navigate("StationInfo", { state: name });
  };

  const toSpecificStation = (id) => {
    navigation.navigate("SpecificStation", { state: id });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    filterStations(value);
  };

  const filterStations = (value) => {
    const filteredStations = getStationNames().filter((station) =>
      station.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStations(filteredStations);
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

  const getStationNames = () => {
    return searchTerm
      ? filteredStations
      : Object.entries(stationsData).map(([id, station]) => ({
          id,
          name: station.name,
        }));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredStations([]);
  };

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>All Stations</Text>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            placeholder="Search station..."
            value={searchTerm}
            onChangeText={handleSearchChange}
            style={styles.searchInput}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButtonContainer}>
              <Ionicons name="close" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={clearSearch} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      {searchTerm ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.scrollContent}>
            {getStationNames().map((station) => (
              <TouchableOpacity
                key={station.id}
                onPress={() => toSpecificStation(station.id)}
              >
                <Text style={[styles.stationName, dynamicStyles.stationName]}>
                  {station.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={dynamicStyles.stopsContainer}>{getStationsInRows()}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingLeft: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  stopsContainer: {
    flex: 1,
    flexDirection: "column",
    marginTop: 40,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  stop: {
    width: 80,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 30,
  },
  stopText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stationName: {
    fontSize: 20,
    marginBottom: 10,
  },
  clearButtonContainer: {
    position: "absolute",
    right: 10,
  },
  cancelButton: {
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#888",
    fontSize: 16,
  },
});

const lightStyles = {
  container: {
    ...styles.container,
    backgroundColor: "#f5f5f5",
  },
  title: {
    ...styles.title,
  },
  stopsContainer: {
    ...styles.stopsContainer,
    backgroundColor: "#f5f5f5",
  },
  stopText: {
    ...styles.stopText,
  },
  stationName: {
    color: "black", // Light mode color
  },
};

const darkStyles = {
  container: {
    ...styles.container,
    backgroundColor: "#333",
  },
  title: {
    ...styles.title,
    color: "white",
  },
  stopsContainer: {
    ...styles.stopsContainer,
    backgroundColor: "#333",
  },
  stopText: {
    ...styles.stopText,
    color: "white",
  },
  stationName: {
    color: "white", // Dark mode color
  },
};

export default BrowseScreen;