import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messagesEn from "./en";
import messagesHr from "./hr";

const i18n = createI18n({
  locale: "en-US",
  legacy: false,
  messages: {
    hr: {
      ...messagesHr
    },
    en: {
      ...messagesEn
    }
  }
});

export default boot(({ app }) => {
  app.use(i18n);
});

export { i18n };
