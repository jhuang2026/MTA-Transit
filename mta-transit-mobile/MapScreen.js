import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import stationsData from "./assets/stations.json";
import markerIconRed from "./assets/marker-icon-red.png";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import coordinatesData from "./assets/coordinates.json";
import { useDispatch, useSelector } from 'react-redux';
import { addToStarredList, removeFromStarredList } from './redux/actions';


export default function MapScreen() {
  const [info, setInfo] = useState({ data: [], updated: "" });
  const [mapCenter, setMapCenter] = useState({
    latitude: 40.758,
    longitude: -73.9855,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [mapMoving, setMapMoving] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchData = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/by-location?lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        console.log(data);
        setInfo(data);
      } catch (error) {
        console.log("Error: " + error.message);
      }
    };

    fetchData(mapCenter.latitude, mapCenter.longitude);

    const interval = setInterval(() => {
      fetchData(mapCenter.latitude, mapCenter.longitude);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [mapCenter]);

  const getRemainingTime = (time) => {
    const remainingSeconds = Math.max(
      0,
      Math.floor((new Date(time) - Date.now()) / 1000)
    );

    if (remainingSeconds === 0) {
      return "BOARD";
    } else if (remainingSeconds < 60) {
      return `${remainingSeconds}s`;
    } else {
      const remainingMinutes = Math.floor(remainingSeconds / 60);
      return `${remainingMinutes}m`;
    }
  };

  const getElapsedTime = () => {
    const updatedTime = new Date(info.updated);
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - updatedTime) / 1000);

    if (elapsedSeconds < 60) {
      return `${elapsedSeconds} seconds ago`;
    } else {
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      return `${elapsedMinutes} minute${elapsedMinutes !== 1 ? "s" : ""} ago`;
    }
  };

  const Station = ({ station, stopData }) => {
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.starredStationsReducer);
    const isFavorite = favorites.includes(station.id);
    const getCircleSize = (index) => {
      if (index === 1) {
        return { width: 65, height: 65 };
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
      const remainingSeconds = Math.max(
        0,
        Math.floor((new Date(time) - Date.now()) / 1000)
      );

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
      const remainingSeconds = Math.max(
        0,
        Math.floor((new Date(time) - Date.now()) / 1000)
      );

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
        console.log("Removing star for station " + stationId);
        dispatch(removeFromStarredList(stationId));
      } else {
        console.log("Adding star for station " + stationId);
        dispatch(addToStarredList(stationId));
      }
    };    

    return (
      <View style={styles.eachStop}>
         <View style={styles.stationHeader}>
          <Text style={styles.stationName}>{station.name}</Text>
          <TouchableOpacity
            onPress={() => toggleStar(station.id)}
            style={styles.starButton}
          >
            <MaterialCommunityIcons
              name="star"
              size={24}
              color={isFavorite ? "#ffd60a" : "black"}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.routeText}>
          Routes: {orderRoutes(station.routes).join(", ")}
        </Text>

        <View style={styles.routesContainer}>
          <View style={styles.directionContainer}>
            <View style={styles.directionTextContainer}>
              <Text style={styles.directionText}>
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
                      borderColor: route.time
                        ? getCircleColor(route.time, index)
                        : "grey",
                      backgroundColor: index === 0 ? "white" : undefined,
                      zIndex: index === 0 ? 2 : 1,
                      marginLeft: index === 1 ? -15 : undefined,
                    },
                  ]}
                >
                  <Text style={styles.timeText}>
                    {route.time ? getRemainingTime(route.time) : "..."}
                  </Text>
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
                  <Text style={styles.timeText}>...</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.directionContainer}>
            <View style={styles.directionTextContainer}>
              <Text style={styles.directionText}>
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
                      borderColor: route.time
                        ? getCircleColor(route.time, index)
                        : "grey",
                      backgroundColor: index === 0 ? "white" : undefined,
                      zIndex: index === 0 ? 2 : 1,
                      marginLeft: index === 1 ? -15 : undefined,
                    },
                  ]}
                >
                  <Text style={styles.timeText}>
                    {route.time ? getRemainingTime(route.time) : "..."}
                  </Text>
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
                  <Text style={styles.timeText}>...</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const zoomIn = () => {
    mapRef.current?.animateToRegion({
      latitude: mapCenter.latitude,
      longitude: mapCenter.longitude,
      latitudeDelta: mapCenter.latitudeDelta / 2,
      longitudeDelta: mapCenter.longitudeDelta / 2,
    });
  };

  const zoomOut = () => {
    mapRef.current?.animateToRegion({
      latitude: mapCenter.latitude,
      longitude: mapCenter.longitude,
      latitudeDelta: mapCenter.latitudeDelta * 2,
      longitudeDelta: mapCenter.longitudeDelta * 2,
    });
  };

  const onRegionChange = () => {
    setMapMoving(true);
  };

  const onRegionChangeComplete = (region) => {
    setMapMoving(false);
    setMapCenter(region);
  };

  const [polylines, setPolylines] = useState([]);
  const [displayedCoordinates, setDisplayedCoordinates] = useState("");

  useEffect(() => {
    const parsedCoordinates = Object.entries(coordinatesData).map(
      ([key, value]) => ({
        key,
        coordinates: value.map(([latitude, longitude]) => ({
          latitude,
          longitude,
        })),
      })
    );
    setPolylines(parsedCoordinates);
    setDisplayedCoordinates(
      parsedCoordinates
        .map(
          ({ key, coordinates }) =>
            `${key}: [${coordinates
              .map(
                ({ latitude, longitude }) =>
                  `{ latitude: ${latitude}, longitude: ${longitude} }`
              )
              .join(", ")}]`
        )
        .join("\n")
    );
  }, []);

  const getColorForInitialLetter = (initialLetter) => {
    switch (initialLetter) {
      case "A":
      case "C":
      case "E":
        return "#0039A6";
      case "B":
      case "D":
      case "F":
      case "M":
        return "#FF6319";
      case "G":
        return "#6CBE45";
      case "J":
      case "Z":
        return "#996633";
      case "L":
        return "#A7A9AC";
      case "N":
      case "Q":
      case "R":
        return "#FCCC0A";
      case "S":
        return "#808183";
      case "1":
      case "2":
      case "3":
        return "#EE352E";
      case "4":
      case "5":
      case "6":
        return "#00933C";
      case "7":
        return "#B933AD";
      default:
        return "#000000"; // Default color if no matching case is found
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text>Elapsed Time: {getElapsedTime()}</Text>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={mapCenter}
            showsUserLocation={true}
            onRegionChange={onRegionChange}
            onRegionChangeComplete={onRegionChangeComplete}
            onUserLocationChange={(event) =>
              setUserLocation(event.nativeEvent.coordinate)
            }
            userInterfaceStyle={"dark"}
          >
            {Object.values(stationsData).map((station) => (
              <Marker
                key={station.id}
                coordinate={{
                  latitude: station.location[0],
                  longitude: station.location[1],
                }}
                title={station.name}
                // Remove the pinColor prop
              >
                <Icon name="circle-outline" size={10} color="white" />
              </Marker>
            ))}
            {polylines.map(({ key, coordinates }) => {
              const shiftedCoordinates = coordinates.map(
                ({ latitude, longitude }) => ({
                  latitude: latitude,
                  longitude: longitude,
                })
              );
              return (
                <Polyline
                  key={key}
                  coordinates={shiftedCoordinates}
                  strokeWidth={2}
                  strokeColor={getColorForInitialLetter(key.charAt(0))}
                />
              );
            })}
          </MapView>
          <View style={[styles.markerContainer, mapMoving && { opacity: 0.5 }]}>
            <Image source={markerIconRed} style={styles.markerIcon} />
          </View>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => {
              if (userLocation) {
                mapRef.current?.animateToRegion({
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                  latitudeDelta: mapCenter.latitudeDelta,
                  longitudeDelta: mapCenter.longitudeDelta,
                });
              }
            }}
          >
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.zoomButtonContainer}>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
            <MaterialCommunityIcons name="plus" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
            <MaterialCommunityIcons name="minus" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {info &&
          info.data.map((stop) => (
            <Station key={stop.id} station={stop} stopData={stop} />
          ))}
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -12,
    marginTop: -36,
    zIndex: 999,
  },
  markerIcon: {
    width: 30,
    height: 40,
  },
  eachStop: {
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  stationData: {
    marginTop: 10,
  },
  zoomButtonContainer: {
    position: "absolute",
    top: 30,
    right: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  locationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
  },
  stationName: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 5,
  },
  routesContainer: {
    marginTop: 10,
  },
  directionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  directionText: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 18,
  },
  directionTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-front",
    paddingRight: 10,
  },
  routeText: {
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // Align circles to the right
    marginBottom: 10,
  },
  spacer: {
    width: 10, // Adjust as needed
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
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: "black",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  starButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

