import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { api } from './api';
import { Link } from 'react-router-dom';
import stationsData from "./stations.json";

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
      return `${remainingMinutes}m${remainingMinutes !== 1 ? "s" : ""}`;
    }
  };
  
  return (
    <div className="eachStop">
      <h2>{station.name}</h2>

      <div className="stationData">
        <p>Direction: {stationsData[station.id]?.north_direction}</p>
        <ul>
          {stopData.N.slice(0, 5).map((route, index) => (
            <li key={index}>
              Route: {route.route}, Time: {getRemainingTime(route.time)}
            </li>
          ))}
        </ul>
      </div>

      <div className="stationData">
        <p>Direction: {stationsData[station.id]?.south_direction}</p>
        <ul>
          {stopData.S.slice(0, 5).map((route, index) => (
            <li key={index}>
              Route: {route.route}, Time: {getRemainingTime(route.time)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


function StationInfo() {
  const location = useLocation();
  const [info, setInfo] = useState({ data: [], updated: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${api.base}/by-route/${location.state}`);
      setInfo(response.data);
    } catch (error) {
      console.log('Error: ' + error.message);
    }
  }, [location.state]);

  useEffect(() => {
    fetchData();

    const timer = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [fetchData]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStations = info.data.filter((stop) =>
    stop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Stations on Route: {location.state}</h1>

      <input
        type="text"
        placeholder="Search station..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {filteredStations.map((stop) => (
        <Station key={stop.id} station={stop} stopData={stop} />
      ))}

      <Link to="/directory" className="buttonContainer">
        <button>Go to Directory</button>
      </Link>
    </div>
  );
}

export default StationInfo;
