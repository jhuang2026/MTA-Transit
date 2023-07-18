import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, useColorScheme } from "react-native";
import { useSelector } from 'react-redux';
import { api } from "./components/api";
import stationsData from "./assets/stations.json";

const Station = ({ station, stopData, isDarkModeEnabled }) => {
  const getRemainingTime = (time) => {
    const remainingSeconds = Math.max(
      0,
      Math.floor((new Date(time) - Date.now()) / 1000)
    );

    if (remainingSeconds === 0) {
      return "BOARDING";
    } else if (remainingSeconds < 60) {
      return `${remainingSeconds} seconds`;
    } else {
      const remainingMinutes = Math.floor(remainingSeconds / 60);
      return `${remainingMinutes} minutes`;
    }
  };

  const textStyle = isDarkModeEnabled ? styles.stationName : styles.stationNameDark;

  return (
    <View style={styles.eachStop}>
      <Text style={textStyle}>{station.name}</Text>

      <View style={styles.stationData}>
        <Text>Direction: {stationsData[station.id]?.north_direction}</Text>
        {stopData.N.slice(0, 5).map((item, index) => (
          <Text key={index}>
            Route: {item.route}, Time: {getRemainingTime(item.time)}
          </Text>
        ))}
      </View>

      <View style={styles.stationData}>
        <Text>Direction: {stationsData[station.id]?.south_direction}</Text>
        {stopData.S.slice(0, 5).map((item, index) => (
          <Text key={index}>
            Route: {item.route}, Time: {getRemainingTime(item.time)}
          </Text>
        ))}
      </View>
    </View>
  );
};

function FavoritesScreen() {
  const isDarkModeEnabled = useSelector(state => state.darkModeReducer);
  const favorites = useSelector(state => state.starredStationsReducer);
  const colorScheme = useColorScheme();

  const [info, setInfo] = useState({ data: [], updated: "" });

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `${api.base}/by-id/${favorites.length > 0 ? favorites.join(",") : ""}`
      );
      const data = await response.json();
      setInfo(data);
    } catch (error) {
      console.log("Error: " + error.message);
    }
  }, [favorites]);

  useEffect(() => {
    fetchData();

    const timer = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [fetchData]);

  return (
    <View style={[styles.container, isDarkModeEnabled ? styles.containerDark : null]}>
      <Text style={[styles.text, isDarkModeEnabled ? styles.textDark : null]}>
        {favorites.length > 0 ? favorites.join(", ") : "No favorites selected."}
      </Text>
      <ScrollView>
        {info.data.map((station, index) => (
          <Station
            key={index}
            station={station}
            stopData={station}
            isDarkModeEnabled={isDarkModeEnabled}
          />
        ))}
      </ScrollView>
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
    backgroundColor: "#333333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  eachStop: {
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stationNameDark: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  stationData: {
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textDark: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default FavoritesScreen;
