import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { api } from "./components/api";
import stationsData from "./assets/stations.json";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addToStarredList, removeFromStarredList } from './redux/actions';
import { useNavigation } from "@react-navigation/native";

function Station({ station, stopData, isDarkModeEnabled }) {

  const navigation = useNavigation();
  const toSpecificStation = (id) => {
    navigation.navigate("SpecificStation", { state: id });
  };

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.starredStationsReducer);
  const isFavorite = favorites.includes(station.id);
  
  const getCircleSize = (index) => {
    if (index === 1) {
      return { width: 75, height: 75 };
    }
    return { width: 75, height: 75 };
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

  const getRemainingTime = (time) => {
    const remainingSeconds = Math.max(0, Math.floor((new Date(time) - Date.now()) / 1000));

    if (remainingSeconds === 0) {
      return "BOARD";
    } else if (remainingSeconds < 60) {
      return `${remainingSeconds}s`;
    } else {
      const remainingMinutes = Math.floor(remainingSeconds / 60);
      return `${remainingMinutes}m`;
    }
  };

  const getCircleColor = (time, index) => {
    const remainingSeconds = Math.max(0, Math.floor((new Date(time) - Date.now()) / 1000));

    if (remainingSeconds === 0) {
      return "red";
    } else if (remainingSeconds < 60) {
      return "orange";
    } else {
      return index === 1 ? "grey" : "blue";
    }
  };

  const toggleStar = (stationId) => {
    if (isFavorite) {
      console.log("Removing station " + stationId + " from favorites");
      // Dispatch an action to remove the station from the Redux store
      dispatch(removeFromStarredList(stationId));
    } else {
      console.log("Adding station " + stationId + " to favorites");
      // Dispatch an action to add the station to the Redux store
      dispatch(addToStarredList(stationId));
    }
  };  

  const dynamicStyles = useMemo(() => {
    return isDarkModeEnabled ? darkStyles : lightStyles;
  }, [isDarkModeEnabled]);

  return (
    <View style={[styles.eachStop, dynamicStyles.eachStop]}>
      <View style={[styles.stationHeader, dynamicStyles.stationHeader]}>
        <Text style={[styles.stationName, dynamicStyles.stationName]}>{station.name}</Text>
        <TouchableOpacity onPress={() => toggleStar(station.id)} style={styles.starButton}>
          <MaterialCommunityIcons name="star" size={24} color={isFavorite ? "#ffd60a" : dynamicStyles.starColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.stationRoutesContainer}>
          {orderRoutes(station.routes).map((route, index) => (
            <Text key={index} style={styles.stationRouteText}>
              {route}
            </Text>
          ))}
        </View>

      <View style={styles.routesContainer}>
        <TouchableOpacity 
          style={styles.directionContainer} 
          onPress={() => toSpecificStation(station.id)}
        >
          <View style={styles.directionTextContainer}>
            <Text style={[styles.directionText, dynamicStyles.directionText]}>
              {stationsData[station.id]?.north_direction}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            {stopData.N.slice(0, 2).map((route, index) => (
              <View
                key={index}
                style={[
                  styles.timeCircle,
                  getCircleSize(index),
                  {
                    borderColor: route.time ? getCircleColor(route.time, index) : "grey",
                    backgroundColor: index === 0 ? "white" : undefined,
                    zIndex: index === 0 ? 2 : 1,
                    marginLeft: index === 1 ? -13 : undefined,
                  },
                ]}
              >
                <Text style={[styles.timeText, dynamicStyles.timeText]}>
                  {route.time ? getRemainingTime(route.time) : "..."}
                </Text>
                <View style={styles.circleRouteCircle}>
                    <Text style={styles.circleRouteText}>
                      {route.route}
                    </Text>
                  </View>
              </View>
            ))}
            {stopData.N.length < 2 && (
              <View
                style={[
                  styles.timeCircle,
                  getCircleSize(1),
                  { borderColor: "grey", marginLeft: -15 },
                ]}
              >
                <Text style={[styles.timeText, dynamicStyles.timeText]}>...</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.directionContainer} 
            onPress={() => toSpecificStation(station.id)}
        >
          <View style={styles.directionTextContainer}>
            <Text style={[styles.directionText, dynamicStyles.directionText]}>
              {stationsData[station.id]?.south_direction}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            {stopData.S.slice(0, 2).map((route, index) => (
              <View
                key={index}
                style={[
                  styles.timeCircle,
                  getCircleSize(index, "S"),
                  {
                    borderColor: route.time ? getCircleColor(route.time, index) : "grey",
                    backgroundColor: index === 0 ? "white" : undefined,
                    zIndex: index === 0 ? 2 : 1,
                    marginLeft: index === 1 ? -13 : undefined,
                  },
                ]}
              >
                <Text style={[styles.timeText, dynamicStyles.timeText]}>
                  {route.time ? getRemainingTime(route.time) : "..."}
                </Text>
                <View style={styles.circleRouteCircle}>
                    <Text style={styles.circleRouteText}>
                      {route.route}
                    </Text>
                  </View>
              </View>
            ))}
            {stopData.S.length < 2 && (
              <View
                style={[
                  styles.timeCircle,
                  getCircleSize(1, "S"),
                  { borderColor: "grey", marginLeft: -15 },
                ]}
              >
                <Text style={[styles.timeText, dynamicStyles.timeText]}>...</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FavoritesScreen() {
  const isDarkModeEnabled = useSelector((state) => state.darkModeReducer);
  const favorites = useSelector((state) => state.starredStationsReducer);

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
    if (favorites.length > 0) {
      fetchData();

      const timer = setInterval(() => {
        fetchData();
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [fetchData, favorites]);

  const dynamicStyles = useMemo(() => {
    return isDarkModeEnabled ? darkStyles : lightStyles;
  }, [isDarkModeEnabled]);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView>
        {favorites.length === 0 ? (
          <Text style={[styles.addFavoriteText, dynamicStyles.addFavoriteText]}>
            Add Your Favorite Stations
          </Text>
        ) : (
          info.data.map((station) => (
            <Station
              key={station.id}
              station={station}
              stopData={station}
              isDarkModeEnabled={isDarkModeEnabled}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  addFavoriteText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 25,
  },
  eachStop: {
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    width: "100%",
  },
  stationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  stationName: {
    fontWeight: "bold",
    fontSize: 22,
    paddingRight: 50,
  },
  starButton: {
    position: "absolute",
    top: 10,
    right: 10,
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
  },
  routesContainer: {
    marginTop: 10,
  },
  circleRouteCircle: {
    width: 25,
    height: 25,
    backgroundColor: '#232b2b',
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -12,
    right: -1,
  },
  circleRouteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  directionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  directionTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingRight: 10,
  },
  directionText: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 18,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  timeCircle: {
    width: 75,
    height: 75,
    borderRadius: 50,
    borderWidth: 2,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 18,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

const lightStyles = {
  container: {
    backgroundColor: "#f5f5f5",
  },
  eachStop: {
    backgroundColor: "#FFFFFF",
  },
  stationHeader: {},
  stationName: {},
  text: {},
};

const darkStyles = {
  container: {
    backgroundColor: "#333",
  },
  stationHeader: {
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  stationName: {
    color: "black",
  },
  text: {
    color: "white",
  },
  addFavoriteText: {
    color: "white",
  },
};

export default FavoritesScreen;
