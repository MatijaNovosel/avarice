import { store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Router } from "vue-router";
import piniaPersist from "pinia-plugin-persist";

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
