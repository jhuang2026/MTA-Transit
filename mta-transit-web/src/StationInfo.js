import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { api } from './api';

function StationInfo() {
  const location = useLocation();
  const [info, setInfo] = useState(null);

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
  }, [fetchData]);

  return (
    <div>
      <h1>Station Info</h1>
      <p>Output: {location.state}</p>

      {info && (
        <div>
          {/* Display the data retrieved from the API */}
          <p>Data: {JSON.stringify(info)}</p>
        </div>
      )}
    </div>
  );
}

export default StationInfo;
