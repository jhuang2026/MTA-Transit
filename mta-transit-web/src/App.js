import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';

import {api} from './api.js';

var GtfsRealtimeBindings = require('gtfs-realtime-bindings');

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the API endpoint
    axios.get(`${api.base}/nyct%2Fgtfs-ace`, {
        headers: {
          'x-api-key': api.key,
        },
        responseType: 'arraybuffer',
      })

      .then((response) => {
        // Convert response data to a binary buffer
        const buffer = Buffer.from(response.data, 'binary');

        // Parse the data from protobuf buffer
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);

        // Access the decoded message from the feed
        console.log(feed);
        console.log('Receiving Data');

        // Update the state with the feed entities
        setData(feed.entity);
      })

      .catch((error) => {
        console.log('Error: ' + error.message);
      });
  }, []);

  return (
    <div>
      <h1>MTA GTFS Realtime API</h1>
      <h2>Feed Entities</h2>
      {data.map((entity, index) => (
        <p key={index}>{JSON.stringify(entity)}</p>
      ))}
    </div>
  );
}

export default App;
