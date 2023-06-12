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
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import stationsData from "./assets/stations.json";
import markerIconRed from './assets/marker-icon-red.png';
import { AntDesign } from "@expo/vector-icons";

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

    const getCircleColor = (time) => {
      const remainingSeconds = Math.max(
        0,
        Math.floor((new Date(time) - Date.now()) / 1000)
      );

      if (remainingSeconds === 0) {
        return "red";
      } else if (remainingSeconds < 60) {
        return "orange";
      } else {
        return "blue";
      }
    };

    return (
      <View style={styles.eachStop}>
        <Text style={styles.stationName}>{station.name}</Text>
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
                    { borderColor: getCircleColor(route.time) },
                  ]}
                >
                  <Text style={styles.timeText}>
                    {getRemainingTime(route.time)}
                  </Text>
                </View>
              ))}
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
                    { borderColor: getCircleColor(route.time) },
                  ]}
                >
                  <Text style={styles.timeText}>
                    {getRemainingTime(route.time)}
                  </Text>
                </View>
              ))}
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
            userInterfaceStyle={'dark'}
          >
            {Object.values(stationsData).map((station) => (
              <Marker
                key={station.id}
                coordinate={{
                  latitude: station.location[0],
                  longitude: station.location[1],
                }}
                title={station.name}
                pinColor="orange"
              />
            ))}
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
          <Button title="+" onPress={zoomIn} />
          <Button title="-" onPress={zoomOut} />
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
    position: 'absolute',
    top: '50%',
    left: '50%',
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
    top: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align circles to the right
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
});
