import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getSearchFlight, getSingleFLight } from "../api/flight"; // Assume this is the API function to fetch flights
import { API_KEY } from "../api/constant";

import { IoMdClose } from "react-icons/io";

import { useDebounce } from "use-debounce";

const FlightSearch = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");

  const [departureSearchTerm] = useDebounce(departure, 1000);
  const [destinationSearchTerm] = useDebounce(destination, 1000);

  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState("Round Trip");
  const [passengers, setPassengers] = useState(1);
  const [classType, setClassType] = useState("Economy");

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const [departureAirports, setDepartureAirports] = useState([]);
  const [destinationAirports, setDestinationAirports] = useState([]);
  const [loadingDeparture, setLoadingDeparture] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);

  const [selectedDeparture, setSelectedDeparture] = useState();
  const [selectedDestination, setSelectedDestination] = useState();

  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFlightDetails, setSelectedFlightDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleSearch = async () => {
    // Prepare the payload
    // const payload = {
    //   tripType,
    //   departure,
    //   destination,
    //   departureDate,
    //   returnDate,
    //   passengers,
    //   classType,
    // };

    // const payload = {
    //   originSkyId: selectedDeparture?.skyId,
    //   adults: passengers,
    //   cabinClass: "economy",
    //   currency: "USD",
    //   destinationEntityId: selectedDestination?.entityId,
    //   destinationSkyId: selectedDestination?.skyId,
    //   market: "en-US",
    //   originEntityId: selectedDeparture?.entityId,
    //   // sortBy: "best",
    //   date: departureDate,
    //   returnDate: returnDate,
    //   countryCode: "US",
    // };

    const payload = {
      adults: `${passengers}`,
      // cabinClass: classType.toLowerCase(),
      countryCode: "IN",
      currency: "INR",
      date: departureDate,
      destinationEntityId: selectedDestination?.entityId,
      destinationSkyId: selectedDestination?.skyId,
      market: "en-IN",
      originEntityId: selectedDeparture?.entityId,
      originSkyId: selectedDeparture?.skyId,
      sortBy: "best",
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

  const handleViewDetails = async (flight) => {
    const id = flight?.legs[0]?.id;
    const originID = flight?.legs[0]?.origin?.entityId;
    const destinationID = flight?.legs[0]?.destination?.entityId;
    const date = flight?.legs[0]?.departure;
    setLoadingDetails(true);
    setModalVisible(true);
    try {
      const flightDetails = await getSingleFLight({
        id,
        origin: originID,
        destination: destinationID,
        date,
      });
      setSelectedFlightDetails(flightDetails);
    } catch (error) {
      console.error("Error fetching flight details:", error);
      setSelectedFlightDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFlightDetails(null);
  };

  console.log(flights);

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

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced handlers for fetching airports
  // const handleDepartureChange = debounce((value) => {
  //   setDeparture(value);
  //   fetchAirports(value, setDepartureAirports, setLoadingDeparture);
  // }, 300);

  // const handleDestinationChange = debounce((value) => {
  //   setDestination(value);
  //   fetchAirports(value, setDestinationAirports, setLoadingDestination);
  // }, 300);

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

  //   console.log(departureAirports);

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white py-10">
      {/* <h1 className="text-3xl font-semibold mb-6">Flights</h1> */}

      {/* Search Form */}
      <div className="flex flex-col md:flex-row items-center justify-center bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 md:space-y-0 md:space-x-4">
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
          <option value="Economy">Economy</option>
          <option value="Business">Business</option>
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

      {/* Flights Results */}
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
                    <span className="font-semibold text-gray-300">Price:</span>{" "}
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
            <p className="text-gray-400 text-center mt-10">No flights found</p>
          )
        )}
      </div>
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <IoMdClose size={24} />
            </button>
            {loadingDetails ? (
              <p className="text-center">Loading flight details...</p>
            ) : selectedFlightDetails ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Flight Details</h2>
                <p>
                  <span className="font-semibold">Airline:</span>{" "}
                  {selectedFlightDetails.airline}
                </p>
                <p>
                  <span className="font-semibold">Departure:</span>{" "}
                  {selectedFlightDetails.departureTime}
                </p>
                <p>
                  <span className="font-semibold">Arrival:</span>{" "}
                  {selectedFlightDetails.arrivalTime}
                </p>
                <p>
                  <span className="font-semibold">Price:</span>{" "}
                  {selectedFlightDetails.price?.formatted}
                </p>
                <p>
                  <span className="font-semibold">Cancellation:</span>{" "}
                  {selectedFlightDetails.isCancellationAllowed
                    ? "Allowed"
                    : "Not Allowed"}
                </p>
              </div>
            ) : (
              <p className="text-center text-red-400">
                Failed to load details.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
