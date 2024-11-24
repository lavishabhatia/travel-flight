import React, { useState } from "react";
import Navbar from "../components/Navbar";
import FlightSearch from "../components/FilterSearch";

const Home = () => {
  return (
    <div className="bg-gray-900 h-screen">
      <Navbar />
      <FlightSearch />
    </div>
  );
};

export default Home;
