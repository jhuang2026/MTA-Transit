import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Directory() {
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

  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  const toStationInfo = (name) => {
    navigation.navigate('StationInfo', { state: name });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const filteredStops = stops.filter((stop) =>
    stop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View>
      <Text>List of Stops</Text>
      <TextInput
        placeholder="Search route..."
        value={searchTerm}
        onChangeText={handleSearchChange}
        style={{ marginBottom: 10 }}
      />
      {filteredStops.map((stop, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => toStationInfo(stop.name)}
          style={{
            textDecorationLine: 'none',
            color: stop.textColor,
            backgroundColor: stop.backgroundColor,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <Text>{stop.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginTop: 20 }}>
        <Text>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Directory;
