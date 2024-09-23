import { App, createApp } from "vue";
import AppComponent from "./App.vue";

import { configurePinia } from "./configurations/pinia";
import configureQuasar from "./configurations/quasar";
import { i18n } from "./i18n";
import router from "./router";

import "@/css/app.scss";
import "@mdi/font/css/materialdesignicons.css";
import { configureCharts } from "./configurations/charts";
import { registerCustomComponents } from "./configurations/components";

export function extendApp(app: App) {
  app.use(router);
  app.use(i18n);
  configureQuasar(app);
  configurePinia(app);
  configureCharts();
  registerCustomComponents(app);
}

const app = createApp(AppComponent);
extendApp(app);

app.mount("#app");
