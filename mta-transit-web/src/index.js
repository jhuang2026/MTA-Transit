import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Directory from './Directory';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StationInfo from './StationInfo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/directory" element={<Directory />} />
      <Route path="/station-info" element={<StationInfo />} />
    </Routes>
  </Router>
);
