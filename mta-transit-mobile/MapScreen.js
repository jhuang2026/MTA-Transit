import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import stationsData from './assets/stations.json';

export default function MapScreen() {
  const [info, setInfo] = useState({ data: [], updated: "" });
  const [mapCenter, setMapCenter] = useState({ latitude: 40.7580, longitude: -73.9855 });

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
      return "BOARDING";
    } else if (remainingSeconds < 60) {
      return `${remainingSeconds} seconds`;
    } else {
      const remainingMinutes = Math.floor(remainingSeconds / 60);
      return `${remainingMinutes}m${remainingMinutes !== 1 ? "s" : ""}`;
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
        "SS"
      ];

      routes.sort((a, b) => {
        const indexA = orderedRoutes.indexOf(a);
        const indexB = orderedRoutes.indexOf(b);
        return indexA - indexB;
      });

      return routes;
    };

    return (
      <View style={styles.eachStop}>
        <Text>{station.name}</Text>
        <Text>Routes: {orderRoutes(station.routes).join(", ")}</Text>

        <View style={styles.stationData}>
          <Text>Direction: {stationsData[station.id]?.north_direction}</Text>
          <View>
            {stopData.N.slice(0, 2).map((route, index) => (
              <View key={index}>
                <Text>
                  Route: {route.route}, Time: {getRemainingTime(route.time)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.stationData}>
          <Text>Direction: {stationsData[station.id]?.south_direction}</Text>
          <View>
            {stopData.S.slice(0, 2).map((route, index) => (
              <View key={index}>
                <Text>
                  Route: {route.route}, Time: {getRemainingTime(route.time)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text>Elapsed Time: {getElapsedTime()}</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: mapCenter.latitude,
              longitude: mapCenter.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            onRegionChangeComplete={(region) => {
              setMapCenter({
                latitude: region.latitude,
                longitude: region.longitude,
              });
            }}
          >
            {Object.values(stationsData).map((station) => (
              <Marker
                key={station.id}
                coordinate={{
                  latitude: station.location[0],
                  longitude: station.location[1],
                }}
                title={station.name}
              />
            ))}
          </MapView>
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  eachStop: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  stationData: {
    marginTop: 10,
  },
});
