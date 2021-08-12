import { store } from "quasar/wrappers";
import { InjectionKey } from "vue";
import { createStore, Store as VuexStore, useStore as vuexUseStore } from "vuex";
import userModule from "./userModule";

export interface StateInterface {
  user: unknown;
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol("vuex-key");

// eslint-disable-next-line import/no-mutable-exports
let storeInstance: VuexStore<StateInterface> | null = null;

export default store(() => {
  const Store = createStore<StateInterface>({
    modules: {
      user: userModule
    },
    strict: !!process.env.DEBUGGING
  });
  storeInstance = Store;
  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}

export { storeInstance };
