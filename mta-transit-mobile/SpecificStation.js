import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { api } from "./components/api";
import stationsData from "./assets/stations.json";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const SpecificStation = ({ route }) => {
  const { state } = route.params;
  const [data, setData] = useState([]);
  const isDarkModeEnabled = useSelector((state) => state.darkModeReducer);

  const dynamicStyles = {
    container: isDarkModeEnabled ? darkStyles.container : lightStyles.container,
    title: isDarkModeEnabled ? darkStyles.title : lightStyles.title,
    stationName: isDarkModeEnabled ? lightStyles.stationName : lightStyles.stationName,
    directionText: isDarkModeEnabled ? lightStyles.directionText : lightStyles.directionText,
    routeTimeText: isDarkModeEnabled ? lightStyles.routeTimeText : lightStyles.routeTimeText,
  };

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

  const orderRoutes = (routes) => {
    const orderedRoutes = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "6X",
      "7",
      "7X",
      "A",
      "C",
      "E",
      "N",
      "Q",
      "R",
      "W",
      "B",
      "D",
      "F",
      "FS",
      "M",
      "L",
      "G",
      "J",
      "Z",
      "H",
      "S",
      "SI",
      "SS",
    ];

    routes.sort((a, b) => {
      const indexA = orderedRoutes.indexOf(a);
      const indexB = orderedRoutes.indexOf(b);
      return indexA - indexB;
    });

    return routes;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api.base}/by-id/${state}`);
        const { data } = await response.json();
        setData(data);
      } catch (error) {
        console.log("Error: " + error.message);
      }
    };

    fetchData();
    const timer = setInterval(fetchData, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [state]);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.title, dynamicStyles.title]}>Specific Station</Text>

      {data.map((station, index) => (
        <View key={index} style={styles.stationContainer}>
          <Text style={[styles.stationName, dynamicStyles.stationName]}>
            {station.name}
          </Text>

          <View style={styles.stationRoutesContainer}>
            {orderRoutes(station.routes).map((route, index) => (
              <Text key={index} style={styles.stationRouteText}>
                {route}
              </Text>
            ))}
          </View>

          <View style={styles.stationData}>
            <Text style={[styles.directionText, dynamicStyles.directionText]}>
              North Direction: {stationsData[station.id]?.north_direction}
            </Text>
            {station.N.length > 0 ? (
              station.N.slice(0, 5).map((item, index) => (
                <Text key={index} style={[styles.routeTimeText, dynamicStyles.routeTimeText]}>
                  Route: {item.route}, Time: {getRemainingTime(item.time)}
                </Text>
              ))
            ) : (
              <Text>No upcoming available data for North direction.</Text>
            )}
          </View>

          <View style={styles.stationData}>
            <Text style={[styles.directionText, dynamicStyles.directionText]}>
              South Direction: {stationsData[station.id]?.south_direction}
            </Text>
            {station.S.length > 0 ? (
              station.S.slice(0, 5).map((item, index) => (
                <Text key={index} style={[styles.routeTimeText, dynamicStyles.routeTimeText]}>
                  Route: {item.route}, Time: {getRemainingTime(item.time)}
                </Text>
              ))
            ) : (
              <Text>No upcoming available data for South direction.</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  stationId: {
    fontSize: 20,
  },
  stationContainer: {
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    width: "100%",
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stationRoutesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  stationRouteText: {
    backgroundColor: "#f5f5f5",
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  stationData: {
    marginTop: 10,
  },
  directionText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  routeTimeText: {
    marginBottom: 3,
  },
});

const lightStyles = {
  container: {
    backgroundColor: "#f5f5f5",
  },
  title: {},
  stationName: {},
  directionText: {},
  routeTimeText: {},
};

const darkStyles = {
  container: {
    backgroundColor: "#333",
  },
  title: {
    color: "white",
  },
  stationName: {
    color: "white",
  },
  directionText: {
    color: "white",
  },
  routeTimeText: {
    color: "white",
  },
};

export default SpecificStation;
