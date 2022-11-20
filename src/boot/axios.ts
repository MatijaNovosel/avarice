import axios, { AxiosInstance } from "axios";
import { boot } from "quasar/wrappers";
import { useUserStore } from "src/stores/user";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create({ baseURL: process.env.API_URL });

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  api.interceptors.request.use((config) => {
    const userStore = useUserStore();
    const user = userStore.data;

    if (user) {
      config.headers.Authorization = user ? `Bearer ${user.token}` : "";
    }

    return config;
  });
});

export { api };
