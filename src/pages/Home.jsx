import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import FlightResults from '../components/FlightResults';
import FlightSearch from '../components/FilterSearch';

const Home = () => {
  const [flights, setFlights] = useState([]);

  const fetchFlights = async (criteria) => {
    // Replace with Sky-Scrapper API endpoint
    const response = await axios.get('YOUR_API_ENDPOINT', {
      params: criteria,
    });
    setFlights(response.data.flights || []);
  };

  const handleFilter = (filterCriteria) => {
    // Implement filter logic based on criteria
  };

  return (
    <div className='bg-gray-900 h-screen'>
      <Navbar />
      {/* <SearchBar onSearch={fetchFlights} /> */}
      <FlightSearch />
      
    </div>
  );
};

export default Home;
