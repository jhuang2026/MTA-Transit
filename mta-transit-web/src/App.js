import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import stationsData from "./stations.json";
import { api } from './api';

function App() {
  const [info, setInfo] = useState({ data: [], updated: '' });
  const [mapCenter, setMapCenter] = useState({ latitude: 40.762972, longitude: -73.981823 });
  const mapRef = useRef(null);

  // Function to fetch data from the API
  const fetchData = useCallback(async (latitude, longitude) => {
    try {
      const response = await axios.get(`${api.base}/by-location?lat=${latitude}&lon=${longitude}`);
      console.log(response.data);
      setInfo(response.data);
    } catch (error) {
      console.log('Error: ' + error.message);
    }
  }, []);

  useEffect(() => {
    // Get user's current location and fetch data
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMapCenter({ latitude, longitude });
            fetchData(latitude, longitude);
          },
          (error) => {
            console.log('Error getting location:', error.message);
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
    };

    // Get user's current location and fetch data

    // Set interval to fetch data every 10 seconds
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
      return `${elapsedMinutes} minute${elapsedMinutes !== 1 ? 's' : ''} ago`;
    }
  };

  // Destructure data from state
  const stopData = info.data;

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
      moveend: handleMapMove
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
          console.log('Error getting location:', error.message);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

// Function to calculate remaining time until train arrival
const getRemainingTime = (time) => {
  const remainingSeconds = Math.max(0, Math.floor((new Date(time) - Date.now()) / 1000));

  if (remainingSeconds === 0) {
    return "BOARDING";
  } else if (remainingSeconds < 60) {
    return `${remainingSeconds} seconds`;
  } else {
    const remainingMinutes = Math.floor(remainingSeconds / 60);
    return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }
};


  return (
    <div className="simulate-mobile">
      <div className="red-marker-image">
        <img src="https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png" alt="Red Marker" />
      </div>
      <MapContainer ref={mapRef} center={[mapCenter.latitude, mapCenter.longitude]} zoom={13}>
        <MapEvents /> 
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render markers for each station */}
        {Object.values(stationsData).map(station => (
          <Marker
            key={station.id}
            position={station.location}
            icon={
              L.icon({
                iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })
            }
          >
            <Popup>
              <p>Station Name: {station.name}</p>
              <p>Location: {station.location.join(', ')}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className='buttonContainer'>
        <button onClick={moveToCurrentLocation}>Move to Current Location</button>
      </div>

      <h1>MTA GTFS Realtime API</h1>

      <p>Last Updated Time: {getElapsedTime()}</p>

      {stopData.map((stop) => (
        <div key={stop.id} className='eachStop'>
          <h2>Stop Name: {stop.name}</h2>
          <p>Routes: {stop.routes.join(', ')}</p>

          <p>Upcoming N Routes:</p>
          <ul>
            {stop.N.slice(0, 2).map((route, index) => (
              <li key={index}>
                Route: {route.route}, Time: {getRemainingTime(route.time)}
              </li>
            ))}
          </ul>
          <p>Upcoming S Routes:</p>
          <ul>
            {stop.S.slice(0, 2).map((route, index) => (
              <li key={index}>
                Route: {route.route}, Time: {getRemainingTime(route.time)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
