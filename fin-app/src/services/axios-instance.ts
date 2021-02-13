import axios from "axios";
import environmentVariables from "@/constants/environment-variables.json";

const axiosInstance = axios.create({
  baseURL: environmentVariables.apiUrl
});

export default axiosInstance;
