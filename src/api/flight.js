import axios from "axios";
import { API_KEY, BASE_IP } from "./constant";

export const getSearchFlight = async (query) => {
  let queryParams = "";

  if (typeof query === "object") {
    Object.keys(query).forEach((key, i) => {
      if (query[key]) {
        queryParams +=
          key +
          "=" +
          query[key] +
          (i === Object.keys(query).length - 1 ? "" : "&");
      }
    });
  }

  try {
    const res = await axios.get(
      `${BASE_IP}/v1/flights/searchFlights?${queryParams}`,
      {
        // params: { query, locale: "en-US" },
        headers: {
          "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
          "x-rapidapi-key": API_KEY,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getSingleFLight = async (id,origin, destination, date) => {
  try {
    const legs = JSON.stringify(
      {
        id, // Include flight ID if needed by the API
        origin,
        destination,
        date,
      },
    );

    const res = await axios.get(`${BASE_IP}/v1/flights/getFlightDetails`, {
      params: {
        legs: legs,
        adults: 1,
        currency: "USD",
        locale: "en-US",
        market: "en-US",
        countryCode: "US",
      },
      headers: {
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        "x-rapidapi-key": API_KEY,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching flight details:", error);
    throw error;
  }
};
