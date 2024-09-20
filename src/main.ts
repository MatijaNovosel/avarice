import { App, createApp } from "vue";
import AppComponent from "./App.vue";

import { configureAxios } from "./configurations/axios";
import { i18n } from "./configurations/i18n";
import { configurePinia } from "./configurations/pinia";
import configureQuasar from "./configurations/quasar";
import { router } from "./configurations/router";

import "@/css/app.scss";
import "@mdi/font/css/materialdesignicons.css";
import { configureCharts } from "./configurations/charts";
import { registerCustomComponents } from "./configurations/components";

export function extendApp(app: App) {
  app.use(router).use(i18n);
  configureQuasar(app);
  configurePinia(app);
  configureAxios();
  configureCharts();
  registerCustomComponents(app);
}

const app = createApp(AppComponent);
extendApp(app);

app.mount("#app");
