import { store } from "quasar/wrappers";
import { InjectionKey } from "vue";
import { createStore, Store as VuexStore, useStore as vuexUseStore } from "vuex";
import userModule from "./userModule";
import appModule from "./appModule";

export interface StateInterface {
  user: unknown;
  app: unknown;
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol("vuex-key");

export default store(() => {
  const Store = createStore<StateInterface>({
    modules: {
      user: userModule,
      app: appModule
    },
    strict: !!process.env.DEBUGGING
  });
  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}
