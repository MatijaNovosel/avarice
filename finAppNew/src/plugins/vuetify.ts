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
    options: {
      customProperties: false
    },
    themes: {
      light: {
        accent: "#0e76bc",
        primary: "#105fa9",
        success: "#4fb749",
        warning: "#d66716",
        error: "#c73826",
        info: "#3DC6F4"
      }
    }
  }
});
