import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persistedstate";
import { App } from "vue";

export const configurePinia = (app: App) => {
  const pinia = createPinia();
  pinia.use(piniaPersist);
  app.use(pinia);
};
