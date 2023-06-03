import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import stationsData from "./stations.json";
import { api } from './api';

function App() {
  const [info, setInfo] = useState({ data: [], updated: '' });
  const mapRef = useRef(null);

  const fetchData = useCallback(async (latitude, longitude) => {
    try {
      const response = await axios.get(`${api.base}/by-location?lat=${latitude}&lon=${longitude}`);
      console.log(response.data);
      console.log('Receiving Data');
      setInfo(response.data);
    } catch (error) {
      console.log('Error: ' + error.message);
    }
  }, []);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
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

    getLocation();

    const interval = setInterval(getLocation, 30000); // Fetch data every 30 seconds

    return () => {
      clearInterval(interval); // Clean up interval on component unmount
    };
  }, [fetchData]);

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

  const stopData = info.data;

  function handleMapMove(event) {
    const { lat, lng } = event.target.getCenter();
    console.log("inside", lat, lng);
    fetchData(lat, lng); // Fetch data when map moves
  }

  function MapEvents() {
    useMapEvents({
      moveend: handleMapMove
    });

    return null;
  }

  function moveToCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const map = mapRef.current;
          map.setView([latitude, longitude]);
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

  return (
    <div>
      <MapContainer ref={mapRef} center={[40.762972, -73.981823]} zoom={13}>
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
        <button onClick={() => fetchData(40.762972, -73.981823)}>Refresh</button>
      </div>

      <h1>MTA GTFS Realtime API</h1>
      <h2>Feed Entities</h2>

      <p>Last Updated Time: {getElapsedTime()}</p>

      {stopData.map((stop) => (
        <div key={stop.id} className='eachStop'>
          <p>Stop Name: {stop.name}</p>
          <p>Routes: {stop.routes.join(', ')}</p>
          <p>Location: {stop.location.join(', ')}</p>
          <p>Stops:</p>

          <p>Upcoming N Routes:</p>
          <ul>
            {stop.N.slice(0, 5).map((route, index) => (
              <li key={index}>
                Route: {route.route}, Time: {route.time}
              </li>
            ))}
          </ul>
          <p>Upcoming S Routes:</p>
          <ul>
            {stop.S.slice(0, 5).map((route, index) => (
              <li key={index}>
                Route: {route.route}, Time: {route.time}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
