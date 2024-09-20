import { Dialog, Loading, Quasar } from "quasar";
import { App } from "vue";

import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import "@quasar/extras/material-icons-round/material-icons-round.css";
import "@quasar/extras/material-icons-sharp/material-icons-sharp.css";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/roboto-font/roboto-font.css";

import "quasar/dist/quasar.css";

export default (app: App) => {
  app.use(Quasar, {
    plugins: { Loading, Dialog },
    config: {
      brand: {
        primary: "#D50000",
        secondary: "#26A69A",
        accent: "#9C27B0",
        dark: "#1D1D1D",
        positive: "#21BA45",
        negative: "#C10015",
        info: "#31CCEC",
        warning: "#F2C037"
      }
    }
  });
};
