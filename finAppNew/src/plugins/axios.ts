import axios from "axios";
import store from "../store";
import Constants from "../constants/constants";
import router from "../router";
import RouteNames from "../constants/routeNames";

axios.interceptors.request.use(
  config => {
    config.url = Constants.API_BASE_URL + config.url;
    if (config.method === "get") {
      config.url +=
        (config.url?.indexOf("?") !== -1 ? "&t=" : "?t=") +
        new Date().getTime();
    }
    // config.withCredentials = true;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response === undefined) {
      return Promise.reject(error);
    }

    if (error.response.status === 500) {
      console.error("Bruh");
      return Promise.reject(error);
    }

    if (error.response.status === 403) {
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      store.dispatch("user/logout");
      router.push({ name: RouteNames.DASHBOARD });
      return Promise.reject(error);
    }

    if (error.response.status === 400) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
