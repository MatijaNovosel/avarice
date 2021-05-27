import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";

import App from "./App.vue";

import router from "./router";
import axios from "axios";
import store from "./store";
import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n";

import "babel-polyfill";
import "./registerServiceWorker";
import "./validators";

import ComponentsPlugin from "./plugins/components";

import "@mdi/font/css/materialdesignicons.css";
import "./assets/css/site.css";

axios.interceptors.request.use(
  config => {
    const user = store.getters["user/data"];
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    config.withCredentials = true;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);
Vue.use(ComponentsPlugin);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount("#app");
