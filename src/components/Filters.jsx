import React from 'react';

const Filters = ({ onFilter }) => {
  return (
    <div className="bg-gray-100 shadow p-4 rounded">
      <h3 className="font-bold mb-2">Filters</h3>
      <div className="space-y-2">
        <div>
          <label className="block">Price Range</label>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            onChange={(e) => onFilter({ price: e.target.value })}
          />
        </div>
        <div>
          <label className="block">Airlines</label>
          <select onChange={(e) => onFilter({ airline: e.target.value })}>
            <option value="">All</option>
            <option value="Air India">Air India</option>
            <option value="Indigo">Indigo</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
