import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { AppStateInterface } from "./state";

const getters: GetterTree<AppStateInterface, StateInterface> = {
  createTransactionTrigger(state): boolean {
    return state.createTransactionTrigger;
  },
  accentColor(state): string | null {
    return state.accentColor;
  }
};

export default getters;
