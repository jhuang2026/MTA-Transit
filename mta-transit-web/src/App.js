import React, { useState, useEffect } from 'react';
import { api } from './api';

const https = require('https');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

function App() {
  console.log("One");

  const [feedEntities, setFeedEntities] = useState([]);

  console.log("Two");

  useEffect(() => {
    const fetchData = () => {
      https.get(
        `${api.base}/nyct%2Fgtfs-ace`,
        { headers: { "x-api-key": api.key } },
        (resp) => {
          let data = [];

          resp.on('data', (chunk) => {
            data.push(chunk);
          });

          resp.on('end', () => {
            const buffer = Buffer.concat(data);

            // Parse the data from protobuf buffer
            const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);

            // Access the decoded message
            console.log(feed);

            setFeedEntities(feed.entity);
          });
        }
      ).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    };
  }, []);

  return (
    <div>
      <h1>MTA GTFS Realtime API</h1>
      <h2>Feed Entities</h2>
    </div>
  );
}

export default App;
