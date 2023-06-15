import React, { useState, useEffect, useCallback } from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { api } from "./components/api";
import stationsData from "./assets/stations.json";



const Station = ({ station, stopData }) => {
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

  return (
    <View style={styles.eachStop}>
      <Text style={styles.stationName}>{station.name}</Text>

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

function StationInfoScreen() {
  const route = useRoute();
  const [info, setInfo] = useState({ data: [], updated: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `${api.base}/by-route/${route.params.state}`
      );
      const data = await response.json();
      setInfo(data);
    } catch (error) {
      console.log("Error: " + error.message);
    }
  }, [route.params.state]);

  useEffect(() => {
    fetchData();

    const timer = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [fetchData]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredStations = info.data.filter((stop) =>
    stop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stations on Route: {route.params.state}</Text>

      <TextInput
        placeholder="Search station..."
        value={searchTerm}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      <ScrollView>
        {filteredStations.map((item, index) => (
          <Station key={index} station={item} stopData={item} />
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
  stationData: {
    marginTop: 10,
  },
});

export default StationInfoScreen;
