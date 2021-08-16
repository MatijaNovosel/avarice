/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-param-reassign */
import { boot } from "quasar/wrappers";
import axios, { AxiosInstance } from "axios";
import CONSTANTS from "src/utils/constants";
import { AppUser } from "src/models/user";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create({ baseURL: CONSTANTS.API_URL });

export default boot(({ app, store }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  api.interceptors.request.use((config) => {
    const user = store.getters["user/data"] as AppUser;

    if (user) {
      config.headers.Authorization = user ? `Bearer ${user.token}` : "";
    }

    return config;
  });
});

export { api };
