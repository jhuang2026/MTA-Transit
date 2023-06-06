import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Directory() {
  // Define the list of stops
  const stops = [
    { name: 'A', backgroundColor: '#0039A6', textColor: 'white' },
    { name: 'C', backgroundColor: '#0039A6', textColor: 'white' },
    { name: 'E', backgroundColor: '#0039A6', textColor: 'white' },
    { name: 'B', backgroundColor: '#FF6319', textColor: 'white' },
    { name: 'D', backgroundColor: '#FF6319', textColor: 'white' },
    { name: 'F', backgroundColor: '#FF6319', textColor: 'white' },
    { name: 'M', backgroundColor: '#FF6319', textColor: 'white' },
    { name: 'G', backgroundColor: '#6CBE45', textColor: 'white' },
    { name: 'J', backgroundColor: '#996633', textColor: 'white' },
    { name: 'Z', backgroundColor: '#996633', textColor: 'white' },
    { name: 'L', backgroundColor: '#A7A9AC', textColor: 'white' },
    { name: 'N', backgroundColor: '#FCCC0A', textColor: 'white' },
    { name: 'Q', backgroundColor: '#FCCC0A', textColor: 'white' },
    { name: 'R', backgroundColor: '#FCCC0A', textColor: 'white' },
    { name: 'S', backgroundColor: '#808183', textColor: 'white' },
    { name: '1', backgroundColor: '#EE352E', textColor: 'white' },
    { name: '2', backgroundColor: '#EE352E', textColor: 'white' },
    { name: '3', backgroundColor: '#EE352E', textColor: 'white' },
    { name: '4', backgroundColor: '#00933C', textColor: 'white' },
    { name: '5', backgroundColor: '#00933C', textColor: 'white' },
    { name: '6', backgroundColor: '#00933C', textColor: 'white' },
    { name: '7', backgroundColor: '#B933AD', textColor: 'white' },
  ];

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const toStationInfo = (name) => {
    navigate('/station-info', { state: name });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStops = stops.filter((stop) =>
    stop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>List of Stops</h1>
      <input
        type="text"
        placeholder="Search route..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px' }}
      />
      {filteredStops.map((stop, index) => (
        <div
          key={index}
          onClick={() => toStationInfo(stop.name)}
          style={{
            textDecoration: 'none',
            color: stop.textColor,
            backgroundColor: stop.backgroundColor,
            display: 'block',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          {stop.name}
        </div>
      ))}

      <Link to="/" className="buttonContainer">
        <button>Go to Home</button>
      </Link>

    </div>
  );
}

export default Directory;
