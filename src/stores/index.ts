import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";
import { store } from "quasar/wrappers";
import { Router } from "vue-router";

declare module "pinia" {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store(() => {
  const pinia = createPinia();
  pinia.use(piniaPersist);
  return pinia;
});
