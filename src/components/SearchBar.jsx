import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'round-trip',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-6 rounded-md max-w-4xl mx-auto mt-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          name="from"
          placeholder="From"
          value={formData.from}
          onChange={handleChange}
          className="p-3 border rounded"
          required
        />
        <input
          type="text"
          name="to"
          placeholder="To"
          value={formData.to}
          onChange={handleChange}
          className="p-3 border rounded"
          required
        />
        <input
          type="date"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
          className="p-3 border rounded"
          required
        />
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          className="p-3 border rounded"
        />
        <select
          name="tripType"
          value={formData.tripType}
          onChange={handleChange}
          className="p-3 border rounded"
        >
          <option value="round-trip">Round Trip</option>
          <option value="one-way">One Way</option>
        </select>
        <input
          type="number"
          name="passengers"
          min="1"
          value={formData.passengers}
          onChange={handleChange}
          className="p-3 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 col-span-full"
        >
          Search Flights
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
