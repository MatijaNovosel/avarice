import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { AppStateInterface } from "./state";

const getters: GetterTree<AppStateInterface, StateInterface> = {
  createTransactionTrigger(state): boolean {
    return state.createTransactionTrigger;
  }
};

export default getters;
