import axios from "axios";

export const API = axios.create({
  baseURL:
    // "https://be-orchid-auction.onrender.com",
    "http://localhost:3000",
});
