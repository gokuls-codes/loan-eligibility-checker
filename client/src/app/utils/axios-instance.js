import { SERVER_URL } from "@/constants";
import axios from "axios";

export const AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: SERVER_URL,
});
