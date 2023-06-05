import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import stationsData from "./stations.json";
import { api } from "./api";
import { Link } from "react-router-dom"; // Import Link component from react-router-dom

// Map component
const Map = ({ mapCenter, setMapCenter, fetchData }) => {
  const mapRef = useRef(null);

  // Event handler for map move
  function handleMapMove(event) {
    const { lat, lng } = event.target.getCenter();
    console.log("Map Coordinates:", lat, lng);
    setMapCenter({ latitude: lat, longitude: lng });
    fetchData(lat, lng);
  }

  // Component for map events
  function MapEvents() {
    useMapEvents({
      moveend: handleMapMove,
      zoomstart: handleMapMove,
    });

    return null;
  }

  // Function to move to the user's current location
  function moveToCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const map = mapRef.current;
          map.setView([latitude, longitude]);
          setMapCenter({ latitude, longitude });
          fetchData(latitude, longitude);
        },
        (error) => {
          console.log("Error getting location:", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  return (
    <div className="mapContainer">
      <MapContainer
        ref={mapRef}
        center={[mapCenter.latitude, mapCenter.longitude]}
        zoom={13}
      >
        <MapEvents />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render markers for each station */}
        {Object.values(stationsData).map((station) => (
          <Marker
            key={station.id}
            position={station.location}
            icon={L.icon({
              iconUrl:
                "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            })}
          >
            <Popup>
              <p>Station Name: {station.name}</p>
              <p>Location: {station.location.join(", ")}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="buttonContainer">
        <button onClick={moveToCurrentLocation}>
          Move to Current Location
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------------------------

const Station = ({ station, stopData }) => {
  // Function to calculate remaining time until train arrival
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

  // Function to order routes
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
    <div className="eachStop">
      <h2>{station.name}</h2>
      <h4>Routes: {orderRoutes(station.routes).join(", ")}</h4>

      <div className="stationData">
        <p>Direction: {stationsData[station.id]?.north_direction}</p>
        <ul>
          {stopData.N.slice(0, 2).map((route, index) => (
            <li key={index}>
              Route: {route.route}, Time: {getRemainingTime(route.time)}
            </li>
          ))}
        </ul>
      </div>

      <div className="stationData">
        <p>Direction: {stationsData[station.id]?.south_direction}</p>
        <ul>
          {stopData.S.slice(0, 2).map((route, index) => (
            <li key={index}>
              Route: {route.route}, Time: {getRemainingTime(route.time)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------------------------

function App() {
  const [info, setInfo] = useState({ data: [], updated: "" });
  const [mapCenter, setMapCenter] = useState({
    latitude: 40.762972,
    longitude: -73.981823,
  });

  // Function to fetch data from the API
  const fetchData = useCallback(async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `${api.base}/by-location?lat=${latitude}&lon=${longitude}`
      );
      console.log(response.data);
      setInfo(response.data);
    } catch (error) {
      console.log("Error: " + error.message);
    }
  }, []);

  useEffect(() => {
    // Set interval to fetch data every 1 second
    // Causes the initial delay of 1 second (when application opens) before data is fetched
    const interval = setInterval(() => {
      fetchData(mapCenter.latitude, mapCenter.longitude);
    }, 1000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [fetchData, mapCenter.latitude, mapCenter.longitude]);

  // Function to calculate elapsed time since last updated
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

  return (
    <div className="simulate-mobile">
      <div className="red-marker-image">
        <img
          src="https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png"
          alt="Red Marker"
        />
      </div>
      <Map mapCenter={mapCenter} setMapCenter={setMapCenter} fetchData={fetchData} />

      <h1>MTA GTFS Realtime API</h1>

      <p>Last Updated Time: {getElapsedTime()}</p>

      {/* Render Station component for each stop */}
      {info.data.map((stop) => (
        <Station key={stop.id} station={stop} stopData={stop} />
      ))}

      <Link to="/directory" className="buttonContainer"> {/* Add Link component with 'to' prop pointing to the desired link */}
        <button>Go to Directory</button> {/* Button text */}
      </Link>
    </div>
  );
}

export default App;
