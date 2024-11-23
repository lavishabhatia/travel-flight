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

export const getFilterFlight = async ({ originSkyId, destinationSkyId, originEntityId, destinationEntityId, cabinClass = "economy", adults = 1, sortBy = "best" }) => {
  try {
    const res = await axios.get(`${BASE_IP}/v2/flights/searchFlights`, {
      params: {
        originSkyId,
        destinationSkyId,
        originEntityId,
        destinationEntityId,
        cabinClass,
        adults,
        sortBy,
        currency: "USD",
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
    console.error("Error fetching filtered flight details:", error);
    throw error;
  }
};

