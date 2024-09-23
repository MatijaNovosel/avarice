import { useUserStore } from "@/stores/user";
import axios from "axios";

const api = axios.create();

api.interceptors.request.use((config) => {
  const userStore = useUserStore();
  const user = userStore.data;
  if (user) {
    config.headers.Authorization = user ? `Bearer ${user.token}` : "";
  }
  return config;
});

export { api };
