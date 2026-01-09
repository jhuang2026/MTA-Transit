import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { api } from "./components/api";
import stationsData from "./assets/stations.json";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addToStarredList, removeFromStarredList } from './redux/actions';

const SpecificStation = ({ route }) => {
  const { state } = route.params;
  const [data, setData] = useState([]);
  const isDarkModeEnabled = useSelector((state) => state.darkModeReducer);

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.starredStationsReducer);
  const isFavorite = favorites.includes(state);

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

  const getRouteColor = (route) => {
    const routeColors = {
      '1': '#EE352E', '2': '#EE352E', '3': '#EE352E',
      '4': '#00933C', '5': '#00933C', '6': '#00933C', '6X': '#00933C',
      '7': '#B933AD', '7X': '#B933AD',
      'A': '#0039A6', 'C': '#0039A6', 'E': '#0039A6',
      'B': '#FF6319', 'D': '#FF6319', 'F': '#FF6319', 'FX': '#FF6319', 'M': '#FF6319',
      'N': '#FCCC0A', 'Q': '#FCCC0A', 'R': '#FCCC0A', 'W': '#FCCC0A',
      'S': '#808183',
      'G': '#6CBE45',
      'J': '#996633', 'Z': '#996633',
      'L': '#A7A9AC',
    };
    return routeColors[route] || '#232b2b';
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

  return (
    <View style={[styles.container, dynamicStyles.container]}>

      {data.map((station, index) => (
        <View key={index} style={styles.stationContainer}>

          <TouchableOpacity onPress={() => toggleStar(state)} style={styles.starButton}>
            <MaterialCommunityIcons name="star" size={24} color={isFavorite ? "#ffd60a" : dynamicStyles.starColor} />
          </TouchableOpacity>
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
              station.N.slice(0, 8).map((item, index) => (
                <View style={styles.eachStopData} key={index}>
                  <View style={[styles.circleRouteCircle, { backgroundColor: getRouteColor(item.route) }]}>
                    <Text style={styles.circleRouteText}>
                      {item.route}
                    </Text>
                  </View>
                  <Text key={index} style={styles.routeTimeText}>
                    {getRemainingTime(item.time)}
                  </Text>
                </View>
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
              station.S.slice(0, 8).map((item, index) => (
                <View style={styles.eachStopData} key={index}>
                  <View style={[styles.circleRouteCircle, { backgroundColor: getRouteColor(item.route) }]}>
                    <Text style={styles.circleRouteText}>
                      {item.route}
                    </Text>
                  </View>
                  <Text key={index} style={styles.routeTimeText}>
                    {getRemainingTime(item.time)}
                  </Text>
                </View>
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
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 5,
    paddingRight: 50,
  },
  stationRoutesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: -5,
  },
  stationRouteText: {
    backgroundColor: "#f5f5f5",
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  stationData: {
    marginTop: 25,
    display: "flex",
    gap: 10,
  },
  directionText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  routeTimeText: {
    marginLeft: 30,
    fontSize: 16,
    fontWeight: 400,
  },
  starButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
  },
  circleRouteCircle: {
    width: 25,
    height: 25,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  circleRouteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eachStopData: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 5,
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
