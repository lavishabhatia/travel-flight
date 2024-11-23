import axios from "axios";
import { API_KEY, BASE_IP } from "./constant";

export const getSearchAirportCode = async (query) => {
  try {
    const res = await axios.get(`${BASE_IP}/v1/flights/searchAirport`, {
      params: { query, locale: "en-US" },
      headers: {
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        "x-rapidapi-key": API_KEY,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
