import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getFilterFlight, getSearchFlight } from "../api/flight"; // Assume this is the API function to fetch flights
import { API_KEY } from "../api/constant";

import { IoMdClose } from "react-icons/io";

import { useDebounce } from "use-debounce";

const sortOptions = [
  { label: "Best", value: "best" },
  { label: "Cheapest", value: "price_high" },
  { label: "Fastest", value: "fastest" },
  { label: "Outbound Take Off Time", value: "outbound_take_off_time" },
  { label: "Outbound Landing Time", value: "outbound_landing_time" },
  { label: "Return Take Off Time", value: "return_take_off_time" },
  { label: "Return Landing Time", value: "return_landing_time" },
];

const classTypeArray = [
  { label: "Economy", value: "economy" },
  { label: "Premium Economy", value: "premium_economy" },
  { label: "Business", value: "business" },
  { label: "First", value: "first" },
];


const FlightSearch = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");

  const [departureSearchTerm] = useDebounce(departure, 1000);
  const [destinationSearchTerm] = useDebounce(destination, 1000);

  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState("Round Trip");
  const [passengers, setPassengers] = useState(1);
  const [classType, setClassType] = useState("economy");

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const [departureAirports, setDepartureAirports] = useState([]);
  const [destinationAirports, setDestinationAirports] = useState([]);
  const [loadingDeparture, setLoadingDeparture] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);

  const [selectedDeparture, setSelectedDeparture] = useState();
  const [selectedDestination, setSelectedDestination] = useState();

  const [error, setError] = useState(null);
  const [cabinClass, setCabinClass] = useState("economy");
  const [sortBy, setSortBy] = useState("best");

  const handleSearch = async () => {
    const payload = {
      adults: `${passengers}`,
      countryCode: "IN",
      currency: "INR",
      date: departureDate,
      destinationEntityId: selectedDestination?.entityId,
      destinationSkyId: selectedDestination?.skyId,
      market: "en-IN",
      originEntityId: selectedDeparture?.entityId,
      originSkyId: selectedDeparture?.skyId,
      sortBy: sortBy,
      cabinClass: classType,
    };

    console.log("Search Payload:", payload);

    try {
      setLoading(true);
      setError(null);

      const response = await getSearchFlight(payload);
      console.log("API Response:", response);

      setFlights(response?.data?.itineraries);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching flights:", error);
      setError("Failed to fetch flights. Please try again.");
      setLoading(false);
    }
  };

  const fetchAirports = async (query, setAirports, setLoading) => {
    if (!query) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport`,
        {
          params: {
            query: query,
            locale: "en-US",
          },
          headers: {
            "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
            "x-rapidapi-key": API_KEY,
          },
        }
      );

      console.log(response?.data);
      setAirports(response?.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching airports:", error);
      setError("Failed to fetch airports. Please try again.");
      setLoading(false);
    }
  };

  const handleFilterFlights = async () => {
    setLoading(true);
    try {
      const flightDetails = await getFilterFlight({
        departure: departureSearchTerm,
        destination: destinationSearchTerm,
        departureDate,
        returnDate,
        tripType,
        passengers: adults,
        classType: cabinClass,
        sortBy,
      });
      setFlights(flightDetails);
    } catch (error) {
      setError("Error fetching flights");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    // Apply selected filters and refresh flight data
    handleFilterFlights();
  };

  useEffect(() => {
    if (departureSearchTerm && destinationSearchTerm) {
      handleFilterFlights();
    }
  }, [departureSearchTerm, destinationSearchTerm]);

  useEffect(() => {
    if (!departureSearchTerm && departureSearchTerm.length < 2) {
      setDepartureAirports([]);
    } else {
      fetchAirports(
        departureSearchTerm,
        setDepartureAirports,
        setLoadingDeparture
      );
    }
  }, [departureSearchTerm]);

  useEffect(() => {
    if (!destinationSearchTerm && destinationSearchTerm.length < 2) {
      setDestinationAirports([]);
    } else {
      fetchAirports(
        destinationSearchTerm,
        setDestinationAirports,
        setLoadingDestination
      );
    }
  }, [destinationSearchTerm]);

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white  gap-4 p-10">
      <div className="grid grid-cols-4 gap-3 w-full items-center justify-center bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 md:space-y-0 md:space-x-4">
        {/* Trip Type */}
        <select
          className="bg-gray-700 px-4 py-2 rounded-lg text-sm"
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
        >
          <option value="Round Trip">Round Trip</option>
          <option value="One Way">One Way</option>
        </select>

        {/* Passengers */}
        <input
          type="number"
          className="bg-gray-700 px-4 py-2 rounded-lg text-sm"
          min="1"
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
        />

        {/* Class Type */}
        <select
          className="bg-gray-700 px-4 py-2 rounded-lg text-sm"
          value={classType}
          onChange={(e) => setClassType(e.target.value)}
        >
          {classTypeArray?.map((cl, i) => (
            <option defaultChecked={cl.value === classType} value={cl.value} key={`${cl.value}-${i}`}>{cl.label}</option>

          ))}
          {/* <option value="Business">Business</option> */}
        </select>

        {/* Departure */}

        <div className=" relative">
          {selectedDeparture ? (
            <div className="bg-gray-700 px-4 py-2 rounded-lg text-sm flex items-center justify-between">
              <p>{selectedDeparture?.presentation?.suggestionTitle}</p>

              <div>
                <span
                  className=" block cursor-pointer rounded-md p-1 border border-white/15"
                  onClick={() => setSelectedDeparture()}
                >
                  <IoMdClose />
                </span>
              </div>
            </div>
          ) : (
            <input
              type="text"
              className="bg-gray-700 px-4 py-2 rounded-lg text-sm"
              placeholder="From"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          )}
          {(loadingDeparture ||
            (!!departureAirports?.length && !selectedDeparture)) && (
            <div className=" absolute top-[120%] rounded-xl w-full left-0 p-3 bg-gray-700">
              {loadingDeparture ? (
                <div>Loading...</div>
              ) : (
                <ul className=" flex flex-col gap-3">
                  {departureAirports?.map((airport) => (
                    <li
                      onClick={() => {
                        setSelectedDeparture(airport);
                        setDeparture("");
                      }}
                      className=" hover:bg-gray-800 transition-all px-1 py-0.5 cursor-pointer rounded-lg"
                    >
                      <p>{airport?.presentation?.suggestionTitle}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className=" relative">
          {selectedDestination ? (
            <div className="bg-gray-700 px-4 py-2 rounded-lg text-sm flex items-center justify-between">
              <p>{selectedDestination?.presentation?.suggestionTitle}</p>

              <div>
                <span
                  className=" block cursor-pointer rounded-md p-1 border border-white/15"
                  onClick={() => setSelectedDestination()}
                >
                  <IoMdClose />
                </span>
              </div>
            </div>
          ) : (
            <input
              type="text"
              className="bg-gray-700 px-4 py-2 rounded-lg text-sm"
              placeholder="To"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          )}
          {(loadingDestination ||
            (!!destinationAirports?.length && !selectedDestination)) && (
            <div className=" absolute top-[120%] rounded-xl w-full left-0 p-3 bg-gray-700">
              {loadingDestination ? (
                <div>Loading...</div>
              ) : (
                <ul className=" flex flex-col gap-3">
                  {destinationAirports?.map((airport) => (
                    <li
                      onClick={() => {
                        setSelectedDestination(airport);
                        setDestination("");
                      }}
                      className=" hover:bg-gray-800 transition-all px-1 py-0.5 cursor-pointer rounded-lg"
                    >
                      <p>{airport?.presentation?.suggestionTitle}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Departure Date */}
        <input
          type="date"
          className="bg-gray-700 px-4 py-2 rounded-lg text-sm"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />

        {/* Return Date */}
        <input
          type="date"
          className="bg-gray-700 px-4 py-2 rounded-lg text-sm"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm"
          disabled={loading}
        >
          {loading ? "Searching..." : "Explore"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="flex gap-3 mt-12 items-start justify-start w-full">
        <div className="flex flex-col bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 md:space-y-0 md:space-x-4 gap-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="sortBy" className="text-gray-300">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-white rounded-md px-4 py-2"
            >
              {sortOptions?.map((opt, i) => (
                <option key={`${opt.label}-${i}`} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md mt-4 md:mt-0"
          >
            Apply Filters
          </button>
        </div>
        <div className="mt-6 w-full max-w-4xl mx-auto">
          {flights?.length > 0 ? (
            <div className="space-y-6">
              {flights?.map((flight, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-8 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Flight Details</h2>
                    <span className="bg-blue-600 px-4 py-2 rounded-full text-sm font-medium shadow-md">
                      {flight?.tags?.join(", ")}
                    </span>
                  </div>
                  <div className="text-base space-y-4">
                    <p>
                      <span className="font-semibold text-gray-300">
                        Departure:
                      </span>{" "}
                      {flight?.legs[0]?.origin?.city}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        Arrival:
                      </span>{" "}
                      {flight?.legs[0]?.destination?.city}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        Duration:
                      </span>{" "}
                      {flight?.legs[0]?.durationInMinutes} minutes
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        Price:
                      </span>{" "}
                      <span className="text-green-400">
                        {flight?.price?.formatted}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        Change Policy:
                      </span>{" "}
                      {flight?.farePolicy?.isChangeAllowed
                        ? "Allowed"
                        : "Not Allowed"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        Cancellation:
                      </span>{" "}
                      {flight?.farePolicy?.isCancellationAllowed
                        ? "Allowed"
                        : "Not Allowed"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(flight)}
                    className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-lg"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <p className="text-gray-400 text-center mt-10">
                No flights found
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
