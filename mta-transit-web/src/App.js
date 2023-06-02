import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { api } from './api';

function App() {
  const [info, setInfo] = useState({ data: [], updated: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api.base}/by-location?lat=40.762972&lon=-73.981823`);
        console.log(response.data);
        console.log('Receiving Data');
        setInfo(response.data);
      } catch (error) {
        console.log('Error: ' + error.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    return () => {
      clearInterval(interval); // Clean up interval on component unmount
    };
  }, []);

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

  return (
    <div>
      <div className='buttonContainer'>
        <button onClick={() => window.location.reload()}>Refresh</button>
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
