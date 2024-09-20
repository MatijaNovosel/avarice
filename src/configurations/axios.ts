import axios from "axios";

export const configureAxios = () => {
  axios.interceptors.request.use((config) => {
    return config;
  });
};
