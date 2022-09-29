import { store } from "quasar/wrappers";
import { InjectionKey } from "vue";
import { createStore, Store as VuexStore, useStore as vuexUseStore } from "vuex";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: VuexStore<any>;
  }
}

export const storeKey: InjectionKey<VuexStore<any>> = Symbol("vuex-key");

export default store(() => {
  const Store = createStore<any>({
    modules: {},
    strict: !!process.env.DEBUGGING
  });
  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}
