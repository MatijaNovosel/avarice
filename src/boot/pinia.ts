import { boot } from "quasar/wrappers";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

const pinia = createPinia();
pinia.use(piniaPersist);

export default boot(({ app }) => {
  app.use(pinia);
});

export { pinia };
