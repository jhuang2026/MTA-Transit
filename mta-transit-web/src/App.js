import React, { useState, useEffect } from 'react';
import { fetchData } from './fetch.js';

function App() {
  console.log("One");
  fetchData();
  console.log("Two");

  return (
    <div>
      <h1>MTA GTFS Realtime API</h1>
      <h2>Feed Entities</h2>
    </div>
  );
}

export default App;
