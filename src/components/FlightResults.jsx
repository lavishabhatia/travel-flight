import React from 'react';

const FlightResults = ({ flights }) => {
  return (
    <div className="container mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Available Flights</h2>
      {flights.length ? (
        <table className="w-full table-auto border-collapse bg-white shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Airline</th>
              <th className="p-3 border">Departure</th>
              <th className="p-3 border">Arrival</th>
              <th className="p-3 border">Duration</th>
              <th className="p-3 border">Price</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-3 border">{flight.airline_name}</td>
                <td className="p-3 border">{flight.departure_time}</td>
                <td className="p-3 border">{flight.arrival_time}</td>
                <td className="p-3 border">{flight.duration}</td>
                <td className="p-3 border">${flight.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No flights available for the selected criteria.</p>
      )}
    </div>
  );
};

export default FlightResults;
