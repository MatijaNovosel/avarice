import Vue from "vue";
import Vuetify from "vuetify/lib";
import i18n from "./i18n";
import hr from "vuetify/es5/locale/hr";

Vue.use(Vuetify);
Vuetify.config.silent = process.env.NODE_ENV == "production";

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  lang: {
    locales: { hr },
    current: "hr",
    t: (key, ...params) => i18n.t(key, params).toString()
  },
  theme: {
    dark: true,
    options: {
      customProperties: false
    }
  }
});
