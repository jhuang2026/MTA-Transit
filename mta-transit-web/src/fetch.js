import { api } from './api';

import axios from "axios";
// const axios = require("axios");
var GtfsRealtimeBindings = require('gtfs-realtime-bindings');

export const fetchData = async () => {
  try {
    const response = await axios.get(`${api.base}/nyct%2Fgtfs-ace`, {
      headers: {
        "x-api-key": api.key
      },
      responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data, 'binary');
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);
    console.log(feed);
    console.log("Receiving Data");
    console.log(feed.entity[1]);
    console.log(feed.entity[1].id);
    console.log(feed.entity[1].vehicle);
  } catch (error) {
    console.log("Error: " + error.message);
  }
}
