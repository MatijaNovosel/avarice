import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";

import App from "./App.vue";

import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n";

import "babel-polyfill";
import "./registerServiceWorker";
import "./validators";
import "./plugins/axios";

import ComponentsPlugin from "./plugins/components";

import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/css/site.css";

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
