import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';

import {api} from './api.js';

var GtfsRealtimeBindings = require('gtfs-realtime-bindings');

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${api.base}/nyct%2Fgtfs-ace`, {
        headers: {
          'x-api-key': api.key,
        },
        responseType: 'arraybuffer',
      })

      .then((response) => {
        const buffer = Buffer.from(response.data, 'binary');

        // Parse the data from protobuf buffer
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);

        // Access the decoded message from the feed
        console.log(feed);
        console.log('Receiving Data');
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
