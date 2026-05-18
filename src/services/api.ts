import axios from "axios";

export const api = axios.create({
  baseURL: "http://172.20.10.3:3001"
});